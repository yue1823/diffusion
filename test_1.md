```
import React, { useEffect } from 'react';
import anime from 'animejs';
import './LogoAnimation.css';

const LogoAnimation: React.FC = () => {
  useEffect(() => {
    anime({
      targets: '.ball1',
      translateY: [
        { value: -300, duration: 1000 },
        { value: -250, duration: 1000 },
      ],
      translateX: [
        { value: 50, duration: 1000 },
        { value: 0, duration: 1000 },
      ],
      easing: 'easeInOutSine',
      loop: false
    });

    anime({
      targets: '.ball2',
      translateY: [
        { value: -300, duration: 1000, delay: 500 },
        { value: -250, duration: 1000 },
      ],
      translateX: [
        { value: -50, duration: 1000, delay: 500 },
        { value: 0, duration: 1000 },
      ],
      easing: 'easeInOutSine',
      loop: false
    });

    anime({
      targets: '.ball3',
      translateY: [
        { value: -300, duration: 1000, delay: 1000 },
        { value: -250, duration: 1000 },
      ],
      translateX: [
        { value: 0, duration: 1000, delay: 1000 },
        { value: 0, duration: 1000 },
      ],
      easing: 'easeInOutSine',
      loop: false,
      complete: () => {
        // 最後一步，顯示最終的logo
        anime({
          targets: '.logo',
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeInOutSine'
        });
      }
    });
  }, []);

  return (
    <div className="logo-animation">
      <img src="/path/to/ball1.svg" className="ball1" alt="Ball 1" />
      <img src="/path/to/ball2.svg" className="ball2" alt="Ball 2" />
      <img src="/path/to/ball3.svg" className="ball3" alt="Ball 3" />
      <img src="/path/to/logo.svg" className="logo" alt="Logo" style={{ opacity: 0 }} />
    </div>
  );
};

export default LogoAnimation;
```
```
.logo-animation {
  position: relative;
  width: 400px; /* 根據你的需要設置寬度 */
  height: 400px; /* 根據你的需要設置高度 */
  margin: 0 auto;
  overflow: hidden;
}

.ball1, .ball2, .ball3 {
  position: absolute;
  bottom: 0;
}

.logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```
`import LogoAnimation from './LogoAnimation';`
