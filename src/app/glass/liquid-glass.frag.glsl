precision highp float;
uniform vec2 uRes;uniform float uTime,uDark,uStr,uGrid,uHue,uDpr;
uniform vec4 uR[8];uniform float uRad[8];uniform int uN;
uniform vec4 uB[24];uniform float uBRad[24];uniform int uBN;
uniform vec3 uD[10];uniform int uDN;
uniform vec3 uRip[8];uniform int uRN;
uniform sampler2D uTex;uniform vec4 uPh;uniform float uPhR,uPhA,uPhOn,uPhS;
uniform vec4 uTop;uniform float uTopR,uTopOn;
float sdRR(vec2 p,vec2 c,vec2 h,float r){vec2 q=abs(p-c)-h+r;return min(max(q.x,q.y),0.)+length(max(q,0.))-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float sdPh(vec2 p){if(uPhOn<.5)return 1e5;vec2 dv=p-uPh.xy;float a=atan(dv.y,dv.x);
  float wob=(sin(a*3.+uTime*.8)+.5*sin(a*5.-uTime*1.25)+.3*sin(a*7.+uTime*.6))*3.2*uDpr*uPhS;
  return sdRR(p,uPh.xy,uPh.zw-4.*uDpr,uPhR)+wob;}
float sceneR(vec2 p){float d=sdPh(p);for(int i=0;i<8;i++){if(i>=uN)break;vec4 r=uR[i];d=min(d,sdRR(p,r.xy,r.zw,uRad[i]));}return d;}
float sceneB(vec2 p){float d=1e5;float k=14.*uDpr;
  for(int i=0;i<24;i++){if(i>=uBN)break;vec4 r=uB[i];d=min(d,sdRR(p,r.xy,r.zw,uBRad[i]));}
  if(uTopOn<.5||sdRR(p,uTop.xy,uTop.zw,uTopR)>=30.*uDpr){for(int i=0;i<10;i++){if(i>=uDN)break;vec3 q=uD[i];d=smin(d,length(p-q.xy)-q.z,k);}}
  return d;}
vec3 hue(float h){return .5+.5*cos(6.2832*(h+vec3(0.,.33,.67)));}
vec3 bg(vec2 p){
  vec3 base=mix(vec3(.945,.948,.956),vec3(.07,.073,.085),uDark);
  vec2 q=p/uRes.y;float t=uTime*.11;float ar=uRes.x/uRes.y;
  vec2 c1=vec2(ar*.22+.12*sin(t),.38+.1*cos(t*1.3));
  vec2 c2=vec2(ar*.78+.1*cos(t*.8),.62+.12*sin(t*1.1));
  vec2 c3=vec2(ar*.52+.16*sin(t*.6+2.),.18+.1*cos(t*.9+1.));
  float b1=exp(-length(q-c1)*3.),b2=exp(-length(q-c2)*2.8),b3=exp(-length(q-c3)*3.4);
  vec3 t1=hue(uHue),t2=hue(uHue+.42),t3=hue(uHue+.18);
  vec3 col=base;
  col=mix(col,mix(mix(vec3(1.),t1,.5),t1*.55,uDark),b1*.75);
  col=mix(col,mix(mix(vec3(1.),t2,.5),t2*.5,uDark),b2*.7);
  col=mix(col,mix(mix(vec3(1.),t3,.5),t3*.5,uDark),b3*.6);
  vec2 m=mod(p,64.*uDpr);float line=clamp(step(m.x,1.*uDpr)+step(m.y,1.*uDpr),0.,1.);
  col=mix(col,mix(vec3(0.),vec3(1.),uDark),line*uGrid*mix(.05,.07,uDark));
  if(uPhOn>.5){
    float sd=sdPh(p);
    if(sd<4.*uDpr){
      vec2 sz=uPh.zw*2.;float sc=max(sz.x/uPhA,sz.y)*1.08;
      vec2 uv=(p-uPh.xy)/(vec2(uPhA,1.)*sc)+vec2(.5,.44);
      vec3 ph=texture2D(uTex,clamp(uv,0.,1.)).rgb;
      float g=dot(ph,vec3(.299,.587,.114));
      ph=mix(ph,vec3(g),.6)*mix(1.,.8,uDark);
      ph=mix(ph,mix(vec3(1.),hue(uHue),.35),.08);
      float vig=smoothstep(4.*uDpr,-22.*uDpr*uPhS,sd);
      col=mix(col,ph,vig);
    }
  }
  return col;
}
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  float dR=sceneR(p),dB=sceneB(p);
  vec2 off=vec2(0.);float spec=0.,edge=0.,shade=0.,tint=0.;
  vec2 L=normalize(vec2(-.55,-.83));float e=1.5;
  if(dR<30.*uDpr){
    vec2 n=normalize(vec2(sceneR(p+vec2(e,0.))-dR,sceneR(p+vec2(0.,e))-dR)+1e-5);
    float dPh=sdPh(p);float isPh=step(abs(dPh-dR),.5*uDpr);
    float sc=mix(1.,uPhS,isPh);
    if(dR>0.){float sh=1.-dR/(30.*uDpr*sc);shade+=max(sh,0.)*max(sh,0.)*.07;}
    else{float band=clamp(-dR/(34.*uDpr*sc),0.,1.);float lens=pow(1.-band,2.4);
      off+=n*lens*uStr*36.*uDpr*sc;spec+=(pow(max(dot(n,L),0.),3.)+.5*pow(max(dot(n,-L),0.),4.))*lens;
      tint+=.13;edge=max(edge,smoothstep(1.7*uDpr,0.,abs(dR+.9*uDpr)));}
  }
  if(dB<24.*uDpr){
    vec2 n=normalize(vec2(sceneB(p+vec2(e,0.))-dB,sceneB(p+vec2(0.,e))-dB)+1e-5);
    if(dB>0.){float sh=1.-dB/(24.*uDpr);shade+=sh*sh*.09;}
    else{float band=clamp(-dB/(20.*uDpr),0.,1.);float lens=pow(1.-band,2.);
      off+=n*lens*uStr*24.*uDpr;spec+=(1.2*pow(max(dot(n,L),0.),3.)+.6*pow(max(dot(n,-L),0.),4.))*lens;
      tint+=.12;edge=max(edge,smoothstep(1.4*uDpr,0.,abs(dB+.8*uDpr)));}
  }
  float inGlass=max(smoothstep(2.*uDpr,-10.*uDpr,dR),smoothstep(1.*uDpr,-6.*uDpr,dB));
  if(inGlass>0.){for(int i=0;i<8;i++){if(i>=uRN)break;vec3 rp=uRip[i];vec2 dv=p-rp.xy;float dist=length(dv)/uDpr;float age=rp.z;
    float front=age*240.;if(dist<front+30.){float amp=7.*exp(-age*2.4)*exp(-abs(dist-front)/(24.+age*40.));
    off+=normalize(dv+1e-4)*sin(dist*.22-age*53.)*amp*uDpr*inGlass;}}}
  vec3 col=vec3(bg(p-off*1.06).r,bg(p-off).g,bg(p-off*.94).b);
  col*=1.-shade*(1.-uDark);col+=shade*uDark*.04;
  col=mix(col,mix(vec3(1.),vec3(.6,.63,.7),uDark),tint*mix(.5,.6,uDark));
  col+=spec*mix(.2,.16,uDark);
  col=mix(col,vec3(1.),edge*mix(.3,.22,uDark));
  gl_FragColor=vec4(col,1.);
}
