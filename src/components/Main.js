require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据 json!
var imageDatas = require('../data/imageData.json');
// console.log(imageDatas)

//利用自执行函数，将图片名信息转成URL路径信息
imageDatas = (function genImageURL(imageDataArr) {

  for(var i = 0,j = imageDataArr.length; i<j; i++){
    var singleImageData = imageDataArr[i];

    singleImageData.imageURL = require('../images/'+singleImageData.fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);


//一张张的图片
var ImgFigure = React.createClass ({
  render:function () {
    return (
      <figure>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
})

class AppComponent extends React.Component {

  render() {

    var controllerUnits =[],
        imgFigures = [];
    // console.log("ig:")
    // console.log(imageDatas[0].data.title)

    imageDatas.forEach(function (value,index) {
      imgFigures.push(<ImgFigure key={index} data={value}/>)
    })

    return (
      <section className="stage">
        <section className = "img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">

        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
