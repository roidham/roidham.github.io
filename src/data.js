class SimpleDataStore{
    constructor(dbName, storeName){
        this.DbName = dbName;
        this.StoreName = storeName;
    }

    async initDb(){
        return await new Promise((resolve, reject) => {
            let open = indexedDB.open(this.DbName, 1);
            open.onupgradeneeded = () => { open.result.createObjectStore(this.StoreName, { autoIncrement: true }) };
            open.onsuccess = () => { resolve(open.result); }
            open.onerror = (event) => { reject(event.target.error?.message); }
        });
    }

    async write(nVal){
        let db = await this.initDb();
        let tx = db.transaction(this.StoreName, 'readwrite');
        tx.objectStore(this.StoreName).put(nVal);
        await new Promise((resolve) => { tx.oncomplete = () =>{ resolve(); } });
        db.close();
    }

    async getAll(){
        let db = await this.initDb();
        let tx = db.transaction(this.StoreName, 'readwrite');
        let req = tx.objectStore(this.StoreName).getAll();
        let res = await new Promise((resolve) => { req.onsuccess = () =>{ resolve(req.result); } })
        await new Promise((resolve, reject) => { tx.oncomplete = () =>{ resolve(); } });
        db.close();
        return res;
    }
}