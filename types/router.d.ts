import Vue, { ComponentOptions, PluginFunction, AsyncComponent } from 'vue'

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent
type Dictionary<T> = { [key: string]: T }
type ErrorHandler = (err: Error) => void

export type RouterMode = "hash" | "history" | "abstract";
export type RawLocation = string | Location;
export type RedirectOption = RawLocation | ((to: Route) => RawLocation);
export type NavigationGuardNext<V extends Vue = Vue> = (to?: RawLocation | false | ((vm: V) => any) | void) => void;
                                
export type NavigationGuard<V extends Vue = Vue> = (
  to: Route,
  from: Route,
  next: NavigationGuardNext<V>
) => any

export declare class VueRouter {
  constructor(options?: RouterOptions)

  app: Vue
  mode: RouterMode
  currentRoute: Route

  beforeEach(guard: NavigationGuard): Function
  beforeResolve(guard: NavigationGuard): Function
  afterEach(hook: (to: Route, from: Route) => any): Function
  push(location: RawLocation): Promise<Route>
  replace(location: RawLocation): Promise<Route>
  push(
    location: RawLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
  replace(
    location: RawLocation,
    onComplete?: Function,
    onAbort?: ErrorHandler
  ): void
  go(n: number): void
  back(): void
  forward(): void
  getMatchedComponents(to?: RawLocation | Route): Component[]
  onReady(cb: Function, errorCb?: ErrorHandler): void
  onError(cb: ErrorHandler): void
  addRoutes(routes: RouteConfig[]): void
  resolve(
    to: RawLocation,
    current?: Route,
    append?: boolean
  ): {
    location: Location
    route: Route
    href: string
    // backwards compat
    normalizedTo: Location
    resolved: Route
  }

  static install: PluginFunction<never>
}

type Position = { x: number; y: number }
type PositionResult = Position | { selector: string; offset?: Position } | void

export interface RouterOptions {
  routes?: RouteConfig[]
  mode?: RouterMode
  fallback?: boolean
  base?: string
  linkActiveClass?: string
  linkExactActiveClass?: string
  parseQuery?: (query: string) => Object
  stringifyQuery?: (query: Object) => string
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: Position | void
  ) => PositionResult | Promise<PositionResult> | undefined | null
}

type RoutePropsFunction = (route: Route) => Object

export interface PathToRegexpOptions {
  sensitive?: boolean
  strict?: boolean
  end?: boolean
}

export interface RouteConfig {
  path: string
  name?: string
  component?: Component
  components?: Dictionary<Component>
  redirect?: RedirectOption
  alias?: string | string[]
  children?: RouteConfig[]
  meta?: any
  beforeEnter?: NavigationGuard
  props?: boolean | Object | RoutePropsFunction
  caseSensitive?: boolean
  pathToRegexpOptions?: PathToRegexpOptions
}

export interface RouteRecord {
  path: string
  regex: RegExp
  components: Dictionary<Component>
  instances: Dictionary<Vue>
  name?: string
  parent?: RouteRecord
  redirect?: RedirectOption
  matchAs?: string
  meta: any
  beforeEnter?: (
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void
  ) => any
  props:
    | boolean
    | Object
    | RoutePropsFunction
    | Dictionary<boolean | Object | RoutePropsFunction>
}

export interface Location {
  name?: string
  path?: string
  hash?: string
  query?: Dictionary<string | (string | null)[] | null | undefined>
  params?: Dictionary<string>
  append?: boolean
  replace?: boolean
}

export interface Route {
  path: string
  name?: string | null
  hash: string
  query: Dictionary<string | (string | null)[]>
  params: Dictionary<string>
  fullPath: string
  matched: RouteRecord[]
  redirectedFrom?: string
  meta?: any
}
