if (typeof self !== 'undefined') {
    self.MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            const workerCode = `
                self.onmessage = function(e) {
                    self.postMessage({});
                };
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            return URL.createObjectURL(blob);
        }
    };
}