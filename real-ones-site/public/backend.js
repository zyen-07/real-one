/* Data layer. Two modes:
   1. Default "local": everything is kept in this browser's localStorage. Good for trying the app in VS Code. Nothing is shared with other devices.
   2. Firebase: set window.RO_CONFIG.firebase in index.html (see README.md). Quizzes and scores are then shared between everyone.
   The app only uses: db.doc(path).get()/set(), db.collection(path).where().limit().get()/add()/onSnapshot(). */
window.RO_BACKEND=async function(){
  const cfg=window.RO_CONFIG||{};
  if(cfg.firebase&&window.firebase){
    firebase.initializeApp(cfg.firebase);
    const cred=await firebase.auth().signInAnonymously();
    return {db:firebase.firestore(),uid:cred.user.uid,name:''};
  }
  return localBackend();
};

function localBackend(){
  const KEY='ro-local-db';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}};
  const write=d=>localStorage.setItem(KEY,JSON.stringify(d));
  const listeners=new Set();
  const notify=()=>listeners.forEach(f=>f());
  window.addEventListener('storage',e=>{if(e.key===KEY)notify()});
  const snapDoc=(id,data)=>({id,exists:data!==undefined,data:()=>data});

  function colRef(path,filters,lim){
    filters=filters||[];
    function snap(){
      const all=read()[path]||{};
      let ids=Object.keys(all).filter(id=>filters.every(f=>f[1]==='=='?all[id][f[0]]===f[2]:true));
      if(lim)ids=ids.slice(0,lim);
      const docs=ids.map(id=>snapDoc(id,all[id]));
      return {docs,size:docs.length,empty:!docs.length};
    }
    return {
      where(f,op,v){return colRef(path,filters.concat([[f,op,v]]),lim)},
      limit(n){return colRef(path,filters,n)},
      async get(){return snap()},
      onSnapshot(next){const run=()=>next(snap());listeners.add(run);setTimeout(run,0);return()=>listeners.delete(run)},
      async add(data){
        const d=read();d[path]=d[path]||{};
        const id='d'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
        d[path][id]=data;write(d);notify();return {id};
      }
    };
  }
  function docRef(col,id){
    return {
      async get(){return snapDoc(id,(read()[col]||{})[id])},
      async set(data){const d=read();d[col]=d[col]||{};d[col][id]=data;write(d);notify()}
    };
  }
  const db={
    doc(path){const i=path.lastIndexOf('/');return docRef(path.slice(0,i),path.slice(i+1))},
    collection(path){return colRef(path)}
  };

  /* Open index.html?as=friend#play-... in another tab to test as a different person. */
  const asFriend=/[?&]as=friend/.test(location.search);
  const store=asFriend?sessionStorage:localStorage;
  let uid=store.getItem('ro-uid');
  if(!uid){uid=(asFriend?'friend-':'owner-')+Math.random().toString(36).slice(2,10);store.setItem('ro-uid',uid)}
  return {db,uid,name:''};
}
