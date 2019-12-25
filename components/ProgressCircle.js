import React from 'react';
import { View, StyleSheet } from 'react-native';

export default class ProgressCircle extends React.Component {
  
  constructor (props) {

    super(props);

    this.state = {
      percent: (this.props.percent || 0),
      radius: (this.props.radius || 35),
      filledColor: (this.props.filledColor || '#BF1A21'), //color of indicator
      unfilledColor: (this.props.unfilledColor || '#CCCCCC'), //color of non-used part of the ring
      bgColor: '#FFFFFF', //color of indicator background
      borderWidth: 7,
      children: null,
    }

  }

  computeDerivedState() {
    
    const { filledColor, unfilledColor } = this.state;
    const { percent } = this.props;
    const pcent = Math.max(Math.min(100, percent), 0)
    const needHalfCircle2 = pcent > 50
    
    let halfCircle1Degree
    let halfCircle2Degree
    
    // degrees indicate the 'end' of the half circle, i.e. they span (degree - 180, degree)
    if (needHalfCircle2) {
      halfCircle1Degree = 180
      halfCircle2Degree = percentToDegrees(pcent)
    } else {
      halfCircle1Degree = percentToDegrees(pcent)
      halfCircle2Degree = 0
    }

    return {
      halfCircle1Degree,
      halfCircle2Degree,
      halfCircle2Styles: {
        // when the second half circle is not needed, we need it to cover
        // the negative degrees of the first circle
        backgroundColor: needHalfCircle2 ? filledColor : unfilledColor,
      },
    }
  }

  renderHalfCircle(rotateDegrees, halfCircleStyles) {

    const { radius, filledColor } = this.state

    return (
      <View
        style={[
          styles.leftWrap,
          {
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <View
          style={[
            styles.halfCircle,
            {
              width: radius,
              height: radius * 2,
              borderRadius: radius,
              overflow: 'hidden',
              transform: [
                { translateX: radius / 2 },
                { rotate: `${rotateDegrees}deg` },
                { translateX: -radius / 2 },
              ],
              backgroundColor: filledColor,
              ...halfCircleStyles,
            },
          ]}
        />
      </View>
    )
  }

  renderInnerCircle() {
    
    const radiusMinusBorder = this.state.radius - this.state.borderWidth
    
    return (
      <View
        style={[
          styles.innerCircle,
          {
            width: radiusMinusBorder * 2,
            height: radiusMinusBorder * 2,
            borderRadius: radiusMinusBorder,
            backgroundColor: this.state.bgColor,
            ...this.props.containerStyle,
          },
        ]}
      >
        {this.props.children}
      </View>
    )
  }

  render() {

    const { radius, unfilledColor } = this.state

    const {
      halfCircle1Degree,
      halfCircle2Degree,
      halfCircle2Styles,
    } = this.computeDerivedState()

    return (
      <View
        style={[
          styles.outerCircle,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: unfilledColor,
          },
        ]}
      >
        {this.renderHalfCircle(halfCircle1Degree)}
        {this.renderHalfCircle(halfCircle2Degree, halfCircle2Styles)}
        {this.renderInnerCircle()}
      </View>
    );
  }

}

function percentToDegrees(percent) {
  return percent * 3.6
}

const styles = StyleSheet.create({
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
})