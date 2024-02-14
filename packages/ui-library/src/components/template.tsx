import { init, h, VNode , classModule,
    propsModule,
    styleModule,
    eventListenersModule,} from 'snabbdom';


// Initialize snabbdom with necessary modules
const patch = init([classModule, propsModule, styleModule, eventListenersModule]);

// Generic types for props and state remain the same
export type Props<T> = T;
export type State<T> = T;

// Enhance the TemplateFunction type to include a method to update state
export type TemplateFunction<P, S> = (props: Props<P>, state: State<S>, updateState: (newState: Partial<S>) => void) => VNode;


export interface LifecycleHooks<S> {
  onMount?: () => void; // Called after the component is mounted to the DOM
  onUpdate?: (oldState: S, newState: S) => void; // Called after the component's state is updated
  onUnmount?: () => void; // Called before the component is removed from the DOM
}


export class Component<P, S> {
  private vnode: VNode;
  private container: Element;
  private hooks: LifecycleHooks<S>;

  constructor(private template: TemplateFunction<P, S>, private props: P, private state: S, containerId: string, hooks?: LifecycleHooks<S>) {
    this.container = document.getElementById(containerId) as Element;
    if (!this.container) {
      throw new Error(`Element with ID '${containerId}' not found.`);
    }
    this.hooks = hooks || {};

    this.vnode = this.container as unknown as VNode;
    this.render();
  }
  
  

  private updateState(newState: Partial<S>): void {
    const oldState = this.state;
    this.state = { ...this.state, ...newState };
    this.render();

    if (this.hooks.onUpdate) {
      this.hooks.onUpdate(oldState, this.state);
    }
  }

  private render(): void {
    const newVNode = this.template(this.props, this.state, this.updateState.bind(this));
    this.vnode = patch(this.vnode, newVNode);
  }
}

