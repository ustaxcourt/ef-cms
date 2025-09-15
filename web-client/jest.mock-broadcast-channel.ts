export class BroadcastChannel {
  name: string;
  onmessage: any = null;
  constructor(name: string) {
    this.name = name;
  }
  postMessage(_msg: any) {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
}
export default BroadcastChannel;
