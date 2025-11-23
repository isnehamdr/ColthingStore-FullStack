import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Scrolldown = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Check scroll position to show/hide button and detect if at bottom
  const toggleVisibility = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Show button when scrolled down more than 300px
    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    
    // Check if we're at the bottom of the page (within 50px)
    if (scrollHeight - scrollTop - clientHeight < 50) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={isAtBottom ? scrollToTop : scrollToBottom}
          className="fixed right-6 bottom-6 z-50 p-3 rounded-full bg-[#bebaa7] text-black border-2 border-black  "
          aria-label={isAtBottom ? "Scroll to top" : "Scroll to bottom"}
        >
          {isAtBottom ? (
            <ChevronUp size={24} className="animate-pulse" />
          ) : (
            <ChevronDown size={24} className="animate-bounce" />
          )}
        </button>
      )}
    </>
  );
};

export default Scrolldown;