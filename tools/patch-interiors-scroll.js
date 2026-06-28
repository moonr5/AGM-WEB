const fs = require("fs");
const path =
  "hubfs/146466316/raw_assets/homepage/179/js_client_assets/assets/island-DwW7ueMe.js";

const old =
  'return Gd(()=>{Ce&&(c||setTimeout(()=>{const Ne=Ot.current,lt=qt.current;Yn.set(Ne,{left:"-50vw"}),Yn.set(lt,{position:"fixed",top:0,right:0,width:"100vw",height:"calc(100vh - 50px)",zIndex:1e3}),Yn.set(Te.current,{opacity:0});const St=Yn.timeline({scrollTrigger:{trigger:Ge.current,start:"top-=50 top",end:"+=200%",scrub:!0,pin:!0}});St.addLabel("animation"),St.to(lt,{width:"66.6vw",ease:"linear",duration:1},"animation"),St.to(Ne,{left:"0",ease:"linear",duration:1},"animation"),St.set(lt,{position:"relative",width:"100%",height:"100%",right:"unset",top:"unset",zIndex:"auto"}),St.to(Te.current,{opacity:1,ease:"linear"},"-=0.5"),St.to({},{duration:.5})},5e3))},[Ce])';

const neu =
  'return Gd(()=>{if(!Ce||c||!Ge.current)return;const Ne=Ot.current,lt=qt.current;if(!Ne||!lt)return;Yn.set(Ne,{left:"-50vw"}),Yn.set(lt,{position:"fixed",top:0,right:0,width:"100vw",height:"calc(100vh - 50px)",zIndex:1e3}),Yn.set(Te.current,{opacity:0});const St=Yn.timeline({scrollTrigger:{trigger:Ge.current,start:"top-=50 top",end:"+=200%",scrub:!0,pin:!0,invalidateOnRefresh:!0}});St.addLabel("animation"),St.to(lt,{width:"66.6vw",ease:"linear",duration:1},"animation"),St.to(Ne,{left:"0",ease:"linear",duration:1},"animation"),St.set(lt,{position:"relative",width:"100%",height:"100%",right:"unset",top:"unset",zIndex:"auto"}),St.to(Te.current,{opacity:1,ease:"linear"},"-=0.5"),St.to({},{duration:.5}),requestAnimationFrame(()=>{tm.refresh()})},[Ce,c])';

const content = fs.readFileSync(path, "utf8");
if (!content.includes(old)) {
  console.error("patch target not found");
  process.exit(1);
}

fs.writeFileSync(path, content.replace(old, neu));
console.log("patched interiors scroll animation");
