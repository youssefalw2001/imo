declare module 'ogl' {
  export class Renderer {
    constructor(options?: Record<string, unknown>);
    gl: OGLRenderingContext;
    setSize(width: number, height: number): void;
    render(options: { scene: unknown; camera?: unknown }): void;
  }
  export class Camera {
    constructor(gl: OGLRenderingContext, options?: Record<string, unknown>);
    position: { x: number; y: number; z: number };
  }
  export class Program {
    constructor(gl: OGLRenderingContext, options?: Record<string, unknown>);
    uniforms: Record<string, { value: unknown }>;
  }
  export class Mesh {
    constructor(gl: OGLRenderingContext, options?: Record<string, unknown>);
  }
  export class Plane {
    constructor(gl: OGLRenderingContext, options?: Record<string, unknown>);
  }
  export interface OGLRenderingContext extends WebGLRenderingContext {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
  }
}
