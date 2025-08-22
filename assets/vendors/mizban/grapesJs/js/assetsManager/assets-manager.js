
function setupAssetsManager(editor) {

  const storageKey = `gjs_assets`;
  
fetch("/images")
  .then(res => res.json())
  .then(imageAssets => {
    const project = JSON.parse(localStorage.getItem(storageKey)) || {};

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        assets: [...(project.assets || []), ...imageAssets]
      })
    );
  });



  editor.on('asset:open', () => {

    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const assets = JSON.parse(saved).assets;
      if (Array.isArray(assets)) {
        const am = editor.AssetManager;
        am.getAll().reset();
        am.add(assets);
        am.render();                     
      }
    } catch (e) {
      console.error('Fail to parse and load assets:', e);
    }
  });

  editor.on('asset:upload:response', (response) => {
    console.log('Asset uploaded successfully:', response);
    const project = JSON.parse(localStorage.getItem(storageKey)) || {};
    const newData = { ...project, assets: [...(project.assets || []), response.data] };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    editor.store();
  });


  editor.on('asset:remove', (removedAsset) => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      let assets = parsed.assets || [];

      const removedSrc = removedAsset.get('src');

      // پاک کردن از localStorage
      assets = assets.filter((a) => {
        if (typeof a === 'string') {
          return a !== removedSrc;
        }
        if (typeof a === 'object' && a.src) {
          return a.src !== removedSrc;
        }
        return true;
      });

      const newData = { ...parsed, assets };
      localStorage.setItem(storageKey, JSON.stringify(newData));


      const formData = new FormData();
      formData.append("filePath", removedSrc);

      // ارسال درخواست حذف فایل به سرور
      fetch('/delete-asset', {
        method: 'POST',
        body: formData
      }).then(res => {
        if (res.ok) {
          console.log('File deleted from server:', removedSrc);
        } else {
          console.warn('Failed to delete file from server');
        }
      }).catch(err => {
        console.error('Error deleting file:', err);
      });

    } catch (e) {
      console.error('Failed to remove asset from localStorage:', e);
    }
  });

}

export { setupAssetsManager };
