```css
body {
  background: linear-gradient(to right, #797777 0%,#656565 20%,#3C3C3C 50%, black 100%);
}

#sky {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

#shootingstars {
  margin: 0;
  padding: 0;
  width: 150vh;
  height: 100vw;
  position: fixed;
  overflow: hidden;
  transform: translatex(calc(50vw - 50%)) translatey(calc(50vh - 50%))
    rotate(120deg);
}

.wish {
  height: 2px;
  top: 300px;
  width: 100px;
  margin: 0;
  opacity: 0;
  padding: 0;
  background-color: white;
  position: absolute;
  background: linear-gradient(-45deg, white, rgba(0, 0, 255, 0));
  filter: drop-shadow(0 0 6px white);
  overflow: hidden;
}



```
```typescript

class StarrySky extends React.Component {
  state = {
    num: 60,
    vw: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    vh: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  };
  starryNight = () => {
    anime({
      targets: ["#sky .star"],
      opacity: [
        {
          duration: 700,
          value: "0"
        },
        {
          duration: 700,
          value: "1"
        }
      ],
      easing: "linear",
      loop: true,
      delay: (el, i) => 50 * i
    });
  };
  shootingStars = () => {
    anime({
      targets: ["#shootingstars .wish"],
      easing: "linear",
      loop: true,
      delay: (el, i) => 2000 * i,
      opacity: [
        {
          duration: 700,
          value: "1"
        }
      ],
      width: [
        {
          value: "150px"
        },
        {
          value: "0px"
        }
      ],
      translateX: 350
    });
  };
  randomRadius = () => {
    return Math.random() * 0.7 + 0.6;
  };
  getRandomX = () => {
    return Math.floor(Math.random() * Math.floor(this.state.vw)).toString();
  };
  getRandomY = () => {
    return Math.floor(Math.random() * Math.floor(this.state.vh)).toString();
  };
  componentDidMount() {
    this.starryNight();
    this.shootingStars();
  }

const Website_page＝（）＝＞｛

return(
      <Row>
          <Col span={12}>
                    <svg id="sky">
                {[...Array(num)].map((x, y) => (
                  <circle
                    cx={this.getRandomX()}
                    cy={this.getRandomY()}
                    r={this.randomRadius()}
                    stroke="none"
                    strokeWidth="0"
                    fill="white"
                    key={y}
                    className="star"
                  />
                ))}
              </svg>
              <div id="shootingstars">
                {[...Array(60)].map((x, y) => (
                  <div
                    key={y}
                    className="wish"
                    style={{
                      left: `${this.getRandomY()}px`,
                      top: `${this.getRandomX()}px`
                    }}
                  />
                ))}
              </div>
      
          </Col>
      </Row>
);
｝;
export default Website_page;
```

```
https://codepen.io/ShaeSco/pen/xxeeeam
```

```
https://codepen.io/yukulele/pen/zYXmQyj
```

Css is dead
```
https://codepen.io/alvaromontoro/pen/GRXGPBP
```
