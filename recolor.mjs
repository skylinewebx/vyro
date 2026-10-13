import sharp from 'sharp';
const {data,info}=await sharp('public/img/hero.jpg').raw().toBuffer({resolveWithObject:true});
const sm=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};
for(let i=0;i<data.length;i+=3){
 let r=data[i]/255,g=data[i+1]/255,b=data[i+2]/255;
 const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,v=mx,s=mx?d/mx:0;
 let h=0;if(d){if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}
 const wp=sm(0.18,0.32,s)*(sm(250,268,h)-sm(335,350,h));
 const wy=sm(0.5,0.62,s)*(sm(40,46,h)-sm(58,64,h));
 if(wp>0){const L=(0.3*r+0.59*g+0.11*b)*0.5+0.02;const nr=L*0.95,ng=L*0.97,nb=L*1.05;r=r*(1-wp)+nr*wp;g=g*(1-wp)+ng*wp;b=b*(1-wp)+nb*wp}
 if(wy>0){const k=Math.min(1.08,v/0.93);const nr=1*k,ng=0.79*k,nb=0;r=r*(1-wy)+Math.min(1,nr)*wy;g=g*(1-wy)+Math.min(1,ng)*wy;b=b*(1-wy)+nb*wy}
 data[i]=r*255;data[i+1]=g*255;data[i+2]=b*255;
}
await sharp(data,{raw:info}).webp({quality:84}).toFile('public/img/hero.webp');
