import React, { useState, useEffect, useRef } from 'react';
import StarBorder from './StarBorder.jsx';
import './StarBorder.css';
import { PRODUCTS, getProductForSlug } from './productsData.js';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const introVideoRef = useRef(null);
  const headerVideoRef = useRef(null);

  const getSlugFromPath = () => {
    const segments = window.location.pathname.split('/').filter(Boolean);
    return segments.pop() || '';
  };

  const [currentProduct, setCurrentProduct] = useState(() => {
    const slug = getSlugFromPath();
    if (!slug || slug === 'index.html') {
      return PRODUCTS[0];
    }
    return getProductForSlug(slug);
  });

  const [notFound, setNotFound] = useState(() => {
    const slug = getSlugFromPath();
    if (!slug || slug === 'index.html') {
      return false;
    }
    return !getProductForSlug(slug);
  });

  useEffect(() => {
    const checkPath = () => {
      const slug = getSlugFromPath();
      if (!slug || slug === 'index.html') {
        window.history.replaceState(null, '', `/${PRODUCTS[0].slug}`);
        setCurrentProduct(PRODUCTS[0]);
        setNotFound(false);
      } else {
        const product = getProductForSlug(slug);
        if (!product) {
          setNotFound(true);
          setCurrentProduct(null);
        } else {
          setNotFound(false);
          setCurrentProduct(product);
        }
      }
    };

    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  useEffect(() => {
    if (currentProduct) {
      document.title = `${currentProduct.displayName || currentProduct.brand} — Bio‑Stimulant Registration Details`;
    } else {
      document.title = 'Page Not Found';
    }
  }, [currentProduct, notFound]);

  useEffect(() => {
    if (notFound) return;

    const playUnmuted = (videoEl) => {
      if (!videoEl) return;
      videoEl.muted = false;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Unmuted playback requires user interaction or policy allowance:', error);
        });
      }
    };

    if (showIntro && introVideoRef.current) {
      playUnmuted(introVideoRef.current);
    }
    if (headerVideoRef.current) {
      playUnmuted(headerVideoRef.current);
    }

    const handleUserInteraction = () => {
      if (introVideoRef.current) {
        introVideoRef.current.muted = false;
        introVideoRef.current.play().catch(() => {});
      }
      if (headerVideoRef.current) {
        headerVideoRef.current.muted = false;
        headerVideoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', handleUserInteraction, { once: true });
    window.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [showIntro, notFound]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image */}
      <img
        className="fixed inset-0 -z-30 w-full h-full object-cover"
        src="/try1.png"
        alt="Background"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      {/* Intro overlay (only on valid pages) */}
      {!notFound && showIntro && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          <video
            ref={introVideoRef}
            className="max-h-screen w-auto"
            src="/intro take 4.mp4"
            autoPlay
            muted={false}
            playsInline
            preload="auto"
            poster="/new.jpeg"
            controls
            onEnded={() => setShowIntro(false)}
          />
          <button
            className="absolute top-4 right-4 px-4 py-2 rounded-md bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowIntro(false)}
          >
            Skip
          </button>
        </div>
      )}

      {/* 404 View when an unknown page is visited */}
      {notFound ? (
        <div className="min-h-screen w-full flex items-center justify-center px-4 relative z-10">
          <StarBorder as="div" className="max-w-lg w-full" color="cyan" speed="5s" thickness={2}>
            <div className="rounded-2xl bg-white/8 border border-white/20 backdrop-blur-md p-8 shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-center">
              <div className="text-4xl mb-3">🌿</div>
              <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
              <p className="text-sm text-white/80 mb-6 leading-relaxed">
                The requested product page was not found. Please choose from the registered products below:
              </p>
              <div className="flex flex-wrap gap-2.5 justify-center">
                {PRODUCTS.map((prod) => (
                  <a
                    key={prod.slug}
                    href={`/${prod.slug}`}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-semibold transition-all hover:scale-105 shadow-md"
                  >
                    {prod.displayName || prod.brand}
                  </a>
                ))}
              </div>
            </div>
          </StarBorder>
        </div>
      ) : (
        <>
          {/* Top spacer */}
          <div className="h-4 sm:h-6" />

          {/* Header box with logo video */}
          <header className="pt-0 sm:pt-0 mt-6 sm:mt-8 pb-6 text-center select-none">
            <div className="mx-auto w-[320px] sm:w-[500px] max-w-[92vw] h-[200px] sm:h-[260px] rounded-2xl bg-white/8 border border-white/20 backdrop-blur-md overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)]">
              <video 
                ref={headerVideoRef}
                src="/lo.mp4" 
                className="w-full h-full object-cover rounded-2xl bg-white/8 backdrop-blur-md ring-1 ring-white/20 shadow-inner" 
                autoPlay 
                loop 
                muted={false}
                playsInline 
                preload="auto"
              />
            </div>
            <div className="mt-2 text-xs sm:text-sm text-white font-semibold tracking-wide">Bio‑Stimulant Registration Details</div>
          </header>

          {/* Main panel */}
          <main className="mx-auto max-w-5xl px-4 sm:px-6 pb-16">
            {/* Product Name FIRST */}
            <section className="mx-auto max-w-3xl mt-6">
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="relative rounded-2xl bg-white/8 border border-white/20 backdrop-blur-md p-4 sm:p-6 flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#e8d8a6]/20 text-[#e8d8a6] mr-4 shadow-inner shrink-0">
                    <span className="text-2xl">🌿</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-xs sm:text-sm">Product Name:</div>
                    <div className="text-white text-xl sm:text-2xl font-semibold tracking-wide">
                      {currentProduct?.displayName || currentProduct?.brand}
                    </div>
                  </div>
                </div>
              </StarBorder>
            </section>

            {/* Gazette Notification SECOND */}
            {currentProduct?.gazette && (
              <section className="mt-6">
                <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                      <span className="text-lg">📰</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[#d9c98f] text-sm">Gazette Notification:</div>
                      <div className="text-white text-base sm:text-lg">{currentProduct.gazette}</div>
                    </div>
                  </div>
                </StarBorder>
              </section>
            )}

            {/* Title of Bio Stimulant THIRD */}
            {currentProduct?.specification && (
              <section className="mt-6">
                <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                      <span className="text-lg">⚗️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[#d9c98f] text-sm">Title of Bio Stimulant:</div>
                      <div className="text-white text-base sm:text-lg">{currentProduct.specification}</div>
                    </div>
                  </div>
                </StarBorder>
              </section>
            )}

            {/* Category of Fertilizers FOURTH */}
            {currentProduct?.category && (
              <section className="mt-6">
                <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                  <div className="flex items-start">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                      <span className="text-lg">🏷️</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-[#d9c98f] text-sm">Category of Fertilizers:</div>
                      <div className="text-white text-base sm:text-lg">{currentProduct.category}</div>
                    </div>
                  </div>
                </StarBorder>
              </section>
            )}

            {/* Info grid with StarBorder */}
            <section className="mt-8 grid grid-cols-1 gap-4">
              {/* Composition */}
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                    <span className="text-lg">🧪</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-sm">Composition:</div>
                    {(currentProduct?.composition || []).length ? (
                      <ul className="mt-1 text-sm sm:text-base text-white list-none pl-0 space-y-1">
                        {(currentProduct.composition || []).map((line, idx) => {
                          const isSubItem = line.trim().startsWith('a.') || line.trim().startsWith('b.');
                          return (
                            <li key={idx} className={isSubItem ? 'pl-6 text-white/90' : 'text-white'}>
                              {line}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="mt-1 text-sm sm:text-base text-white"></div>
                    )}
                  </div>
                </div>
              </StarBorder>

              {/* Crop */}
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                    <span className="text-lg">🌶️</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-sm">Crop:</div>
                    <div className="text-white text-base sm:text-lg">
                      {typeof currentProduct?.crops === 'string'
                        ? currentProduct.crops
                        : (currentProduct?.crops || []).join(', ')}
                    </div>
                  </div>
                </div>
              </StarBorder>

              {/* Dose */}
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                    <span className="text-lg">🧴</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-sm">Dose:</div>
                    {(currentProduct?.dosage || []).length > 1 ? (
                      <ul className="mt-1 text-sm sm:text-base text-white list-none pl-0 space-y-1">
                        {currentProduct.dosage.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-white text-base sm:text-lg">{(currentProduct?.dosage || []).join(' | ')}</div>
                    )}
                  </div>
                </div>
              </StarBorder>

              {/* Manufactured And Marketed By */}
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                    <span className="text-lg">🏭</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-sm">Manufactured And Marketed By:</div>
                    <div className="text-white/90 text-sm sm:text-base font-semibold mt-1">String Bio Private Limited</div>
                    <div className="text-white/90 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      Plot No.168, Vasantha Narasapura Industrial Area,<br/>
                      1st Phase, Tumakuru, Karnataka-572128
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm mt-1">
                      Phone: <a href="tel:9632571893" className="hover:underline text-cyan-300">9632571893</a>, E-mail : <a href="mailto:kumarv@stringbio.com" className="hover:underline text-cyan-300">kumarv@stringbio.com</a>
                    </div>
                  </div>
                </div>
              </StarBorder>

              {/* Corporate Office */}
              <StarBorder as="div" className="w-full" color="cyan" speed="5s" thickness={2}>
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#e8d8a6]/25 text-[#e8d8a6] mr-3 shadow-inner shrink-0">
                    <span className="text-lg">🏢</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[#d9c98f] text-sm">Corporate Office:</div>
                    <div className="text-white/90 text-sm sm:text-base font-semibold mt-1">String Bio Private Limited</div>
                    <div className="text-white/90 text-xs sm:text-sm mt-0.5 leading-relaxed">
                      No.456 G, 1st Main Road,<br/>
                      Vinayaka Nagar,<br/>
                      Opposite Kennametal Widia,<br/>
                      9th Mile, Tumkur Road, Nagasandra,<br/>
                      Bengaluru, Karnataka-560073
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm mt-1">
                      Phone: <a href="tel:9632571893" className="hover:underline text-cyan-300">9632571893</a>, E-mail : <a href="mailto:kumarv@stringbio.com" className="hover:underline text-cyan-300">kumarv@stringbio.com</a>
                    </div>
                  </div>
                </div>
              </StarBorder>
            </section>
          </main>
        </>
      )}
    </div>
  );
}
