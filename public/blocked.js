document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      // In chrome extensions, window.close() works if the tab was opened by a script, 
      // but if we redirected the tab (which we do in content.js), window.close() might be blocked by Chrome.
      // Therefore, let's try standard JS window.close(), and if it doesn't do anything, 
      // fallback to either returning back in history, or redirecting to a safe page.
      
      try {
        window.close();
      } catch (e) {
        console.error(e);
      }
      
      // If it's still here after a tiny delay, window.close() was blocked by browser policies
      setTimeout(() => {
         if (window.history.length > 2) {
             window.history.go(-2);
         } else {
             window.location.replace("chrome://newtab/");
         }
      }, 100);
    });
  }
});
