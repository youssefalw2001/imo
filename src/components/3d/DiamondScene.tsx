import { useEffect, useRef } from 'react';
import { Renderer, Camera, Program, Mesh, Plane } from 'ogl';

const vertex = `attribute vec3 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`;
const fragment = `precision highp float;uniform float uTime;uniform vec2 uResolution;varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float diamond(vec2 uv,vec2 c,float s){vec2 d=abs(uv-c);return 1.0-smoothstep(s*0.8,s,d.x+d.y);}
void main(){vec2 st=(gl_FragCoord.xy-0.5*uResolution)/min(uResolution.x,uResolution.y);float t=uTime*0.3;vec3 col=vec3(0.04,0.04,0.12);
col+=vec3(0.3,0.1,0.5)*noise(st*3.0+t*0.5)*0.15;col+=vec3(0.0,0.5,0.8)*noise(st*5.0-t*0.3)*0.08;col+=vec3(0.9,0.7,0.0)*noise(st*8.0+vec2(t*0.2,-t*0.4))*0.04;
for(int i=0;i<8;i++){float fi=float(i);vec2 pos=vec2(sin(t*0.5+fi*1.3)*0.4,cos(t*0.4+fi*0.9)*0.3);float d=diamond(st,pos,0.02+sin(t+fi)*0.005);col+=mix(vec3(0.0,0.83,1.0),vec3(0.93,0.79,0.0),sin(fi*0.7)*0.5+0.5)*d*0.6;}
col*=1.0-length(st)*0.7;col+=vec3(0.3,0.1,0.5)*(sin(t*2.0)*0.02+0.02);gl_FragColor=vec4(col,1.0);}`;

export function DiamondScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = new Renderer({ canvas, width: window.innerWidth, height: window.innerHeight, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    gl.clearColor(0.04, 0.04, 0.12, 1);
    const camera = new Camera(gl);
    camera.position.z = 1;
    const geometry = new Plane(gl, { width: 2, height: 2 });
    const program = new Program(gl, { vertex, fragment, uniforms: { uTime: { value: 0 }, uResolution: { value: [window.innerWidth, window.innerHeight] } } });
    const mesh = new Mesh(gl, { geometry, program });
    const resize = () => { renderer.setSize(window.innerWidth, window.innerHeight); program.uniforms['uResolution']!.value = [window.innerWidth, window.innerHeight]; };
    window.addEventListener('resize', resize);
    const start = performance.now();
    const animate = () => { program.uniforms['uTime']!.value = (performance.now() - start) / 1000; renderer.render({ scene: mesh, camera }); animRef.current = requestAnimationFrame(animate); };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animRef.current); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" style={{ pointerEvents: 'none' }} />;
}
