const body = document.body;
const head = document.head;

// مسیر صحیح و مطلق از ریشه برای همه فایل‌ه/assets= '/assets';

// بررسی اینکه آیا preview=true در URL هست یا نه
function hasPreviewParam() {
  return window.location.search.includes('preview=true');
}

if (hasPreviewParam()) {
  // const scriptMizchin = document.createElement('script');
  // scriptMizchin.src = `/assets/js/mizchin.min.js`;
  // body.appendChild(scriptMizchin);
} else {
  // افزودن استایل‌ها
  const link1 = document.createElement('link');
  link1.rel = 'stylesheet';
  link1.href = `/assets/vendors/mizban/grapesJs/css/grapesJs.css`;
  head.appendChild(link1);

  const link2 = document.createElement('link');
  link2.rel = 'stylesheet';
  link2.href = `/assets/vendors/mizban/grapesJs/css/editor.css`;
  head.appendChild(link2);

  // لود اسکریپت‌ها به ترتیب
  const script1 = document.createElement('script');
  script1.src = `/assets/vendors/mizban/grapesJs/grapesJs.js`;
  script1.type = 'module';

  wrapBodyContent();
  script1.onload = () => {

    const script2 = document.createElement('script');
    script2.src = `/assets/vendors/mizban/grapesJs/js/editor/editor.js`;
    script2.type = 'module';
    body.appendChild(script2);

    script2.onload = () => {
      const script3 = document.createElement('script');
      script3.src = `/assets/vendors/mizban/playground/vs/loader.min.js`;
      body.appendChild(script3);

      script3.onload = () => {
        const script4 = document.createElement('script');
        script4.src = `/assets/vendors/mizban/grapesJs/js/assetsManager/assets-manager.js`;
        script4.type = 'module';
        body.appendChild(script4);
      };
    };
  };

  body.appendChild(script1);
}

// بسته‌بندی محتوای body داخل یک div#canvas در صورت وجود یک اسکریپت خاص
function wrapBodyContent() {
  const scriptTag = document.querySelector(`script[src*="/assets/vendors/mizban/script.js"]`);
  if (scriptTag) {
    const canvasDiv = document.createElement('div');
    canvasDiv.id = 'canvas';

    while (document.body.firstChild) {
      canvasDiv.appendChild(document.body.firstChild);
    }

    document.body.appendChild(canvasDiv);
  }
  else{
    console.log('No script tag found for wrapping body content.');
  }
}

wrapBodyContent();