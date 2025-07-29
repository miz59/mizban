import imageUrls from '../../../commands/imageUrls.js'

function setupAssetsManager(editor) {
    editor.on('asset:add', (asset) => {
    
        let ar = [];

        let data = new Promise((reolve, reject) => {
            reader.readAsDataURL(JSON.parse(localStorage.getItem('gjsProject')).assets[0]);
          });

        ar.push(data);
        ar.push(asset.id);

        console.log(ar);
        
        localStorage.setItem('gjsProject',JSON.stringify({ ...JSON.parse(localStorage.getItem('gjsProject') || '{}'), assets: ar }));

        imageUrls.forEach(imageUrl => 
            localStorage.setItem('gjsProject',JSON.stringify({ ...JSON.parse(localStorage.getItem('gjsProject') || '{}'), assets: [imageUrl] }))
        );
       
        console.log(JSON.parse(localStorage.getItem('gjsProject')).assets);
        editor.store()
    });
}

function editor_assetsManager(editor) {
    editor.Assets.load("")
    imageUrls.forEach(imageUrl => editor.AssetManager.add(imageUrl));

}

export {editor_assetsManager , setupAssetsManager}