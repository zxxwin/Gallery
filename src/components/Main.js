require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

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

function getRangeRandom(low,high) {
  return Math.floor(Math.random() * (high - low) + low)
}
function get30DegRandom() {
  return ((Math.random()>0.5?'':'-') + Math.floor(Math.random() * 30));
}

//一张张的图片
var ImgFigure = React.createClass ({

  //imgfigure ClickEvent
  handleClick:function (e) {
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },


  render:function () {

    var styleObj = {};

    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    if(this.props.arrange.rotate) {
      (['MozT','msT','WebkitT','t']).forEach(function (value) {
        styleObj[value + 'ransform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this))
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse?' is-inverse':'';


    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
})

class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render(){
    var controllerUnitsClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitsClassName += ' is-center';

      if(this.props.arrange.isInverse){
        controllerUnitsClassName +=' is-inverse';
      }
    }
    return (
      <span className={controllerUnitsClassName}
            onClick={this.handleClick}>
      </span>
    )
  }
}


class AppComponent extends React.Component {

  constructor(props){
    super(props);
    this.Constant={
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //range of horizon
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange: { //range of vertical
        x: [0,0],
        topY:[0,0]
      }
    };

    this.state = {
      imgArrangeArr:[]
    };
  }


  //rotate picture
  inverse(index){
    return function () {
      var imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      this.setState({
        imgArrangeArr:imgArrangeArr
      });
    }.bind(this);
  }

  //make a picture center
  center(index){
    return function () {
      this.rearrange(index);
    }.bind(this)
  }

  //rearrange all picture
  rearrange(centerIndex){
    var imgArrangeArr = this.state.imgArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,
        imgArrangeCenterArr = imgArrangeArr.splice(centerIndex,1);

    //picture in center
    imgArrangeCenterArr[0] = {
      pos:centerPos,
      rotate:0,
      isCenter:true
    }


    topImgSpliceIndex = Math.floor(Math.random() * (imgArrangeArr.length -topImgNum));
    imgArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //picture on TOP
    imgArrangeTopArr.forEach(function (value,index) {
      imgArrangeTopArr[index] ={
        pos : {
        top:getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      };
    });

    //picture on SIDE
    for (var i = 0, j = imgArrangeArr.length,k = j / 2; i <j; i++){
      var hPosRangeLORX = null;

      if(i < k ){
        hPosRangeLORX = hPosRangeLeftSecX;
      }else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgArrangeArr[i] = {
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    }

    if(imgArrangeTopArr && imgArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex,0,imgArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex,0,imgArrangeCenterArr[0]);


    this.setState({
      imgArrangeArr:imgArrangeArr
    });

  }

  componentDidMount(){


    // get size of stage
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // get imageFigure size
    var imgFigureDOM  = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH /2);

    //get center img position
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    }

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH -halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW -imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    var num = Math.floor(Math.random() * 10);

    this.rearrange(num);

  }



  render() {
    var controllerUnits =[],
        imgFigures = [];
    // console.log("ig:")
    // console.log(imageDatas[0].data.title)

    imageDatas.forEach(function (value,index) {

      if(!this.state.imgArrangeArr[index]){
        this.state.imgArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }

      imgFigures.push(
        <ImgFigure key={index}
                   data={value}
                   ref={'imgFigure' + index}
                   arrange={this.state.imgArrangeArr[index]}
                   inverse={this.inverse(index)}
                   center={this.center(index)}
        />
      )

      controllerUnits.push(
        <ControllerUnit
          key={index}
          arrange={this.state.imgArrangeArr[index]}
          inverse={this.inverse(index)}
          center={this.center(index)}
        />
      )
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className = "img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
