/// <reference no-default-lib="true"

// export type Attributes = Partial<HTMLAttributes>
// export interface Attributes {
//   htmlFor: string,
//   href: string
// }
// import type { Request_Origin, Response_Origin } from './types.mts';

export type Custom_Event_Handler = (o: Record<string, any>, e: CustomEvent) => void;
export type Response_Handler = (resp: Response_Origin, req: Request_Origin) => void;
export const Response_States = ['ok', 'invalid', 'try_again', 'not_yet', 'expired'] as const;
export const HTTP_Status_Text = ['unauthorized', 'forbidden', 'not_found']
export const Event_States = ['request', 'network_error', 'server_error', 'response', 'loading'] as const;
export const CSS_States = [...HTTP_Status_Text, ...Response_States, ...Event_States] as const;
export const Action_Methods = ['GET', 'POST']


export interface HTMLDataSet {
  data: {[key: string]: string | number}
}

export interface Request_Origin {
  readonly request: RequestInit,
  readonly action: typeof Action_Methods[number],
  readonly selector: string,  // dom selector, usually '#id'
  do_request: boolean
}

export interface Response_Origin {
  readonly status: typeof Response_States[number],
  readonly data: {
    [index: string]: string
  }
}

export interface Response_Detail {
  request: Request_Origin,
  response: Response_Origin,
}

export interface Network_Error_Origin {
  error: any,
  request: Request_Origin
}
export interface DataSet {
  data: {[key: string]: string | number}
}

export type Attrs<T extends keyof ElementTagNameMap> = Partial<ElementTagNameMap[T] & DataSet>;

export interface AttrElement  {
  classList: string[];
  id: string;
  readonly namespaceURI: string | null;
  autofocus: boolean;
  accessKey: string;
  readonly accessKeyLabel: string;
  autocapitalize: string;
  dir: string;
  draggable: boolean;
  hidden: boolean;
  inert: boolean;
  innerText: string;
  lang: string;
  popover: string | null;
  spellcheck: boolean;
  title: string;
  translate: boolean;
}


interface AnchorElement extends AttrElement, HyperlinkElementUtils {
    download: string;
    hreflang: string;
    ping: string;
    referrerPolicy: string;
    rel: string;
    target: string;
    text: string;
    type: string;
}


interface AreaElement extends AttrElement, HyperlinkElementUtils {
    alt: string;
    coords: string;
    download: string;
    ping: string;
    referrerPolicy: string;
    rel: string;
    shape: string;
    target: string;
}


interface AudioElement extends MediaElement {
}


interface BRElement extends AttrElement {
}


interface BaseElement extends AttrElement {
    href: string;
    target: string;
}



interface BodyElement extends AttrElement {
}

interface ButtonElement extends AttrElement {
    disabled: boolean;
    readonly form: FormElement | null;
    formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
    formTarget: string;
    name: string;
    type: "submit" | "reset" | "button";
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: string;
    readonly willValidate: boolean;
}


interface CanvasElement extends AttrElement {
    height: number;
    width: number;
}


interface DListElement extends AttrElement {
}


interface DataElement extends AttrElement {
    value: string;
}


interface DataListElement extends AttrElement {
}


interface DetailsElement extends AttrElement {
    open: boolean;
}


interface DialogElement extends AttrElement {
    open: boolean;
    returnValue: string;
}


interface DivElement extends AttrElement {
}

interface EmbedElement extends AttrElement {
    height: string;
    src: string;
    type: string;
    width: string;
}


interface FieldSetElement extends AttrElement {
    disabled: boolean;
    name: string;
    readonly type: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    readonly willValidate: boolean;
}


interface FormElement extends AttrElement {
    acceptCharset: string;
    action: string;
    autocomplete: AutoFillBase;
    encoding: string;
    enctype: string;
    readonly length: number;
    method: string;
    name: string;
    noValidate: boolean;
    rel: string;
    target: string;
    [index: number]: Element;
    [name: string]: any;
}

interface HRElement extends AttrElement {
}

interface HeadElement extends AttrElement {
}

interface HeadingElement extends AttrElement {
}

interface Element extends AttrElement {
}


interface HyperlinkElementUtils {
    hash: string;
    host: string;
    hostname: string;
    href: string;
    readonly origin: string;
    password: string;
    pathname: string;
    port: string;
    protocol: string;
    search: string;
    username: string;
}

interface ImageElement extends AttrElement {
    alt: string;
    readonly complete: boolean;
    crossOrigin: string | null;
    readonly currentSrc: string;
    decoding: "async" | "sync" | "auto";
    height: number;
    isMap: boolean;
    loading: "eager" | "lazy";
    readonly naturalHeight: number;
    readonly naturalWidth: number;
    referrerPolicy: string;
    sizes: string;
    src: string;
    srcset: string;
    useMap: string;
    width: number;
    readonly x: number;
    readonly y: number;
}

interface InputElement extends AttrElement, PopoverInvokerElement {
    accept: string;
    alt: string;
    autocomplete: AutoFill;
    capture: string;
    checked: boolean;
    defaultChecked: boolean;
    defaultValue: string;
    dirName: string;
    disabled: boolean;
    files: FileList | null;
    readonly form: FormElement | null;
    formAction: string;
    formEnctype: string;
    formMethod: string;
    formNoValidate: boolean;
    formTarget: string;
    height: number;
    indeterminate: boolean;
    readonly list: DataListElement | null;
    max: string;
    maxLength: number;
    min: string;
    minLength: number;
    multiple: boolean;
    name: string;
    pattern: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    selectionDirection: "forward" | "backward" | "none" | null;
    selectionEnd: number | null;
    selectionStart: number | null;
    size: number;
    src: string;
    step: string;
    type: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: string;
    valueAsDate: Date | null;
    valueAsNumber: number;
    readonly webkitEntries: ReadonlyArray<FileSystemEntry>;
    webkitdirectory: boolean;
    width: number;
    readonly willValidate: boolean;
}

interface LIElement extends AttrElement {
    value: number;
}

interface LabelElement extends AttrElement {
    readonly control: AttrElement | null;
    readonly form: FormElement | null;
    For: string;
}

interface LegendElement extends AttrElement {
    readonly form: FormElement | null;
}

interface LinkElement extends AttrElement, LinkStyle {
    as: string;
    crossOrigin: string | null;
    disabled: boolean;
    href: string;
    hreflang: string;
    imageSizes: string;
    imageSrcset: string;
    integrity: string;
    media: string;
    referrerPolicy: string;
    rel: string;
    type: string;
}


interface MapElement extends AttrElement {
    name: string;
}

interface MediaElement extends AttrElement {
    autoplay: boolean;
    readonly buffered: TimeRanges;
    controls: boolean;
    crossOrigin: string | null;
    readonly currentSrc: string;
    currentTime: number;
    defaultMuted: boolean;
    defaultPlaybackRate: number;
    disableRemotePlayback: boolean;
    readonly duration: number;
    readonly ended: boolean;
    readonly error: MediaError | null;
    loop: boolean;
    readonly mediaKeys: MediaKeys | null;
    muted: boolean;
    readonly networkState: number;
    readonly paused: boolean;
    playbackRate: number;
    readonly played: TimeRanges;
    preload: "none" | "metadata" | "auto" | "";
    preservesPitch: boolean;
    readonly readyState: number;
    readonly remote: RemotePlayback;
    readonly seekable: TimeRanges;
    readonly seeking: boolean;
    src: string;
    srcObject: MediaProvider | null;
    readonly textTracks: TextTrackList;
    volume: number;
    readonly NETWORK_EMPTY: 0;
    readonly NETWORK_IDLE: 1;
    readonly NETWORK_LOADING: 2;
    readonly NETWORK_NO_SOURCE: 3;
    readonly HAVE_NOTHING: 0;
    readonly HAVE_METADATA: 1;
    readonly HAVE_CURRENT_DATA: 2;
    readonly HAVE_FUTURE_DATA: 3;
    readonly HAVE_ENOUGH_DATA: 4;
}

interface MenuElement extends AttrElement {
}

interface MetaElement extends AttrElement {
    content: string;
    httpEquiv: string;
    media: string;
    name: string;
    charset: "utf-8";
}

interface MeterElement extends AttrElement {
    high: number;
    low: number;
    max: number;
    min: number;
    optimum: number;
    value: number;
}


interface ModElement extends AttrElement {
    cite: string;
    dateTime: string;
}


interface OListElement extends AttrElement {
    reversed: boolean;
    start: number;
    type: string;
}


interface ObjectElement extends AttrElement {
    readonly contentDocument: Document | null;
    readonly contentWindow: WindowProxy | null;
    data: string;
    readonly form: FormElement | null;
    height: string;
    name: string;
    type: string;
    useMap: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    width: string;
    readonly willValidate: boolean;
}


interface OptGroupElement extends AttrElement {
    disabled: boolean;
    label: string;
}


interface OptionElement extends AttrElement {
    defaultSelected: boolean;
    disabled: boolean;
    readonly form: FormElement | null;
    readonly index: number;
    label: string;
    selected: boolean;
    text: string;
    value: string;
}


interface OutputElement extends AttrElement {
    defaultValue: string;
    readonly form: FormElement | null;
    name: string;
    readonly type: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: string;
    readonly willValidate: boolean;
}


interface ParagraphElement extends AttrElement {
}


interface PictureElement extends AttrElement {
}

interface PreElement extends AttrElement {
}

interface ProgressElement extends AttrElement {
    max: number;
    readonly position: number;
    value: number;
}


interface QuoteElement extends AttrElement {
    cite: string;
}


interface ScriptElement extends AttrElement {
    async: boolean;
    crossOrigin: string | null;
    defer: boolean;
    integrity: string;
    noModule: boolean;
    referrerPolicy: string;
    src: string;
    text: string;
    type: string;
}


interface SelectElement extends AttrElement {
    autocomplete: AutoFill;
    disabled: boolean;
    readonly form: FormElement | null;
    length: number;
    multiple: boolean;
    name: string;
    required: boolean;
    selectedIndex: number;
    size: number;
    readonly type: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: string;
    readonly willValidate: boolean;
    [name: number]: OptionElement | OptGroupElement;
}


interface SlotElement extends AttrElement {
    name: string;
}


interface SourceElement extends AttrElement {
    height: number;
    media: string;
    sizes: string;
    src: string;
    srcset: string;
    type: string;
    width: number;
}


interface SpanElement extends AttrElement {
}


interface StyleElement extends AttrElement, LinkStyle {
    disabled: boolean;
    media: string;
}

interface TableCaptionElement extends AttrElement {
}


interface TableCellElement extends AttrElement {
    abbr: string;
    readonly cellIndex: number;
    colSpan: number;
    headers: string;
    rowSpan: number;
    scope: string;
}


interface TableColElement extends AttrElement {
    span: number;
}



interface TableElement extends AttrElement {
    caption: TableCaptionElement | null;
    tFoot: TableSectionElement | null;
    tHead: TableSectionElement | null;
}



interface TableRowElement extends AttrElement {
    readonly rowIndex: number;
    readonly sectionRowIndex: number;
}


interface TableSectionElement extends AttrElement {
}


interface TemplateElement extends AttrElement {
    readonly content: DocumentFragment;
}


interface TextAreaElement extends AttrElement {
    autocomplete: AutoFill;
    cols: number;
    defaultValue: string;
    dirName: string;
    disabled: boolean;
    readonly form: FormElement | null;
    maxLength: number;
    minLength: number;
    name: string;
    placeholder: string;
    readOnly: boolean;
    required: boolean;
    rows: number;
    selectionDirection: "forward" | "backward" | "none";
    selectionEnd: number;
    selectionStart: number;
    readonly textLength: number;
    readonly type: string;
    readonly validationMessage: string;
    readonly validity: ValidityState;
    value: string;
    readonly willValidate: boolean;
    wrap: string;
}


interface TimeElement extends AttrElement {
    dateTime: string;
}


interface TitleElement extends AttrElement {
    text: string;
}


interface TrackElement extends AttrElement {
    default: boolean;
    kind: string;
    label: string;
    readonly readyState: number;
    src: string;
    srclang: string;
    readonly track: TextTrack;
    readonly NONE: 0;
    readonly LOADING: 1;
    readonly LOADED: 2;
    readonly ERROR: 3;
}


interface UListElement extends AttrElement {
}


export interface ElementTagNameMap {
    "a": AnchorElement;
    "abbr": AttrElement;
    "address": AttrElement;
    "area": AreaElement;
    "article": AttrElement;
    "aside": AttrElement;
    "audio": AudioElement;
    "b": AttrElement;
    "base": BaseElement;
    "bdi": AttrElement;
    "bdo": AttrElement;
    "blockquote": QuoteElement;
    "body": BodyElement;
    "br": BRElement;
    "button": ButtonElement;
    "canvas": CanvasElement;
    "caption": TableCaptionElement;
    "cite": AttrElement;
    "code": AttrElement;
    "col": TableColElement;
    "colgroup": TableColElement;
    "data": DataElement;
    "datalist": DataListElement;
    "dd": AttrElement;
    "del": ModElement;
    "details": DetailsElement;
    "dfn": AttrElement;
    "dialog": DialogElement;
    "div": DivElement;
    "dl": DListElement;
    "dt": AttrElement;
    "em": AttrElement;
    "embed": EmbedElement;
    "fieldset": FieldSetElement;
    "figcaption": AttrElement;
    "figure": AttrElement;
    "footer": AttrElement;
    "form": FormElement;
    "h1": HeadingElement;
    "h2": HeadingElement;
    "h3": HeadingElement;
    "h4": HeadingElement;
    "h5": HeadingElement;
    "h6": HeadingElement;
    "head": HeadElement;
    "header": AttrElement;
    "hgroup": AttrElement;
    "hr": HRElement;
    "": Element;
    "i": AttrElement;
    "img": ImageElement;
    "input": InputElement;
    "ins": ModElement;
    "kbd": AttrElement;
    "label": LabelElement;
    "legend": LegendElement;
    "li": LIElement;
    "link": LinkElement;
    "main": AttrElement;
    "map": MapElement;
    "mark": AttrElement;
    "menu": MenuElement;
    "meta": MetaElement;
    "meter": MeterElement;
    "nav": AttrElement;
    "noscript": AttrElement;
    "object": ObjectElement;
    "ol": OListElement;
    "optgroup": OptGroupElement;
    "option": OptionElement;
    "output": OutputElement;
    "p": ParagraphElement;
    "picture": PictureElement;
    "pre": PreElement;
    "progress": ProgressElement;
    "q": QuoteElement;
    "rp": AttrElement;
    "rt": AttrElement;
    "ruby": AttrElement;
    "s": AttrElement;
    "samp": AttrElement;
    "script": ScriptElement;
    "search": AttrElement;
    "section": AttrElement;
    "select": SelectElement;
    "slot": SlotElement;
    "small": AttrElement;
    "source": SourceElement;
    "span": SpanElement;
    "strong": AttrElement;
    "style": StyleElement;
    "sub": AttrElement;
    "summary": AttrElement;
    "sup": AttrElement;
    "table": TableElement;
    "tbody": TableSectionElement;
    "td": TableCellElement;
    "template": TemplateElement;
    "textarea": TextAreaElement;
    "tfoot": TableSectionElement;
    "th": TableCellElement;
    "thead": TableSectionElement;
    "time": TimeElement;
    "title": TitleElement;
    "tr": TableRowElement;
    "track": TrackElement;
    "u": AttrElement;
    "ul": UListElement;
    "var": AttrElement;
    "wbr": AttrElement;
}

