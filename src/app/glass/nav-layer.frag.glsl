precision highp float;
uniform vec2 uRes;uniform float uDark,uStr,uDpr;
uniform sampler2D uBase;
uniform vec4 uTop;uniform float uTopR,uTopOn;
uniform vec4 uB[8];uniform float uBRad[8];uniform int uBN;
uniform vec3 uD[10];uniform int uDN;
uniform vec3 uRip[8];uniform int uRN;
float sdRR(vec2 p,vec2 c,vec2 h,float r){vec2 q=abs(p-c)-h+r;return min(max(q.x,q.y),0.)+length(max(q,0.))-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float sdTop(vec2 p){if(uTopOn<.5)return 1e5;return sdRR(p,uTop.xy,uTop.zw,uTopR);}
float sceneB(vec2 p){float d=1e5;float k=14.*uDpr;
  for(int i=0;i<8;i++){if(i>=uBN)break;vec4 r=uB[i];d=min(d,sdRR(p,r.xy,r.zw,uBRad[i]));}
  if(sdTop(p)<30.*uDpr){for(int i=0;i<10;i++){if(i>=uDN)break;vec3 q=uD[i];d=smin(d,length(p-q.xy)-q.z,k);}}
  return d;}
vec3 base(vec2 p){return texture2D(uBase,vec2(p.x,uRes.y-p.y)/uRes).rgb;}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  float dT=sdTop(p),dB=sceneB(p);
  if(dT>=30.*uDpr&&dB>=24.*uDpr){gl_FragColor=vec4(base(p),1.);return;}
  vec2 off=vec2(0.);float spec=0.,edge=0.,shade=0.,tint=0.;
  vec2 L=normalize(vec2(-.55,-.83));float e=1.5;
  if(dT<30.*uDpr){
    vec2 n=normalize(vec2(sdTop(p+vec2(e,0.))-dT,sdTop(p+vec2(0.,e))-dT)+1e-5);
    if(dT>0.){float sh=1.-dT/(30.*uDpr);shade+=max(sh,0.)*max(sh,0.)*.07;}
    else{float depth=clamp(-dT/uTop.w,0.,1.);float lens=1.-depth*depth;
      off+=n*lens*uStr*30.*uDpr;spec+=(pow(max(dot(n,L),0.),3.)+.5*pow(max(dot(n,-L),0.),4.))*lens;
      tint+=.13;edge=max(edge,smoothstep(1.7*uDpr,0.,abs(dT+.9*uDpr)));}
  }
  if(dB<24.*uDpr){
    vec2 n=normalize(vec2(sceneB(p+vec2(e,0.))-dB,sceneB(p+vec2(0.,e))-dB)+1e-5);
    if(dB>0.){float sh=1.-dB/(24.*uDpr);shade+=sh*sh*.09;}
    else{float band=clamp(-dB/(20.*uDpr),0.,1.);float lens=pow(1.-band,2.);
      off+=n*lens*uStr*24.*uDpr;spec+=(1.2*pow(max(dot(n,L),0.),3.)+.6*pow(max(dot(n,-L),0.),4.))*lens;
      tint+=.12;edge=max(edge,smoothstep(1.4*uDpr,0.,abs(dB+.8*uDpr)));}
  }
  float inGlass=max(smoothstep(2.*uDpr,-10.*uDpr,dT),smoothstep(1.*uDpr,-6.*uDpr,dB));
  if(inGlass>0.){for(int i=0;i<8;i++){if(i>=uRN)break;vec3 rp=uRip[i];vec2 dv=p-rp.xy;float dist=length(dv)/uDpr;float age=rp.z;
    float front=age*240.;if(dist<front+30.){float amp=7.*exp(-age*2.4)*exp(-abs(dist-front)/(24.+age*40.));
    off+=normalize(dv+1e-4)*sin(dist*.22-age*53.)*amp*uDpr*inGlass;}}}
  vec3 col=vec3(base(p-off*1.06).r,base(p-off).g,base(p-off*.94).b);
  col*=1.-shade*(1.-uDark);col+=shade*uDark*.04;
  col=mix(col,mix(vec3(1.),vec3(.6,.63,.7),uDark),tint*mix(.5,.6,uDark));
  col+=spec*mix(.2,.16,uDark);
  col=mix(col,vec3(1.),edge*mix(.3,.22,uDark));
  gl_FragColor=vec4(col,1.);
}
