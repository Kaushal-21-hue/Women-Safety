// Standard Create React App PWA service worker registration.
// https://cra.link/PWA

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [IE workaround]
    window.location.hostname === '[::1]' ||
    // [IPv6 localhost]
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/
    )
);

function registerValidSW(swUrl, config) {
    navigator.serviceWorker
        .register(swUrl)
        .then(function (registration) {
            registration.onupdatefound = function () {
                const installingWorker = registration.installing;
                if (installingWorker == null) {
                    return;
                }
                installingWorker.onstatechange = function () {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            console.log(
                                'New content is available and will be used when all ' +
                                'tabs for this page are closed. See https://cra.link/PWA.'
                            );
                            if (config && config.onUpdate) {
                                config.onUpdate(registration);
                            }
                        } else {
                            console.log(
                                'Content is cached for offline use.'
                            );
                            if (config && config.onSuccess) {
                                config.onSuccess(registration);
                            }
                        }
                    }
                };
            };
        })
        .catch(function (error) {
            console.error('Error during service worker registration:', error);
        });
}

function checkValidServiceWorkerUpdate(url, config) {
    fetch(url, {
        headers: { 'Service-Worker': 'script' },
    })
        .then(function (response) {
            const contentType = response.headers.get('content-type');
            if (
                response.status === 404 ||
                (contentType != null && contentType.indexOf('javascript') === -1)
            ) {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.unregister().then(function () {
                        window.location.reload();
                    });
                });
            } else {
                registerValidSW(url, config);
            }
        })
        .catch(function (error) {
            console.log(
                'No internet connection found. App is running in offline mode.'
            );
            registerValidSW(url, config);
        });
}

export function register(config) {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const publicUrl = new URL(
            process.env.PUBLIC_URL,
            window.location.href
        );
        if (publicUrl.origin !== window.location.origin) {
            return;
        }

        window.addEventListener('load', function () {
            const swUrl = `${publicUrl}/service-worker.js`;

            if (isLocalhost) {
                checkValidServiceWorkerUpdate(swUrl, config);
            } else {
                registerValidSW(swUrl, config);
            }
        });
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(function (registration) {
                registration.unregister();
            })
            .catch(function (error) {
                console.error(error.message);
            });
    }
}
