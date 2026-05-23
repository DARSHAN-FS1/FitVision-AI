import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedLine = Animated.createAnimatedComponent(Line);

interface SkeletalAnimationProps {
  exerciseType: 'squat' | 'pushup' | 'deadlift' | 'plank' | 'lunge' | string;
  width?: number;
  height?: number;
}

export const SkeletalAnimation: React.FC<SkeletalAnimationProps> = ({
  exerciseType,
  width = 300,
  height = 300,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous loop animation back and forth
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(progress, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: false,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };
    animate();
    return () => progress.stopAnimation();
  }, [exerciseType]);

  // Interpolated joint coordinates depending on exercise type
  let headY: any, headX: any;
  let shoulderY: any, shoulderX: any;
  let elbowY: any, elbowX: any;
  let wristY: any, wristX: any;
  let hipY: any, hipX: any;
  let kneeY: any, kneeX: any;
  let ankleY: any, ankleX: any;

  // Set default dimensions inside the 300x300 canvas box
  const cX = 150; // Center X

  const cleanType = exerciseType.toLowerCase();

  if (cleanType.includes('squat')) {
    // SQUAT: Vertically standing (0) down to crouch (1)
    headX = new Animated.Value(cX);
    headY = progress.interpolate({ inputRange: [0, 1], outputRange: [50, 110] });

    shoulderX = new Animated.Value(cX);
    shoulderY = progress.interpolate({ inputRange: [0, 1], outputRange: [80, 140] });

    // Arms extended forward slightly
    elbowX = progress.interpolate({ inputRange: [0, 1], outputRange: [120, 110] });
    elbowY = progress.interpolate({ inputRange: [0, 1], outputRange: [90, 140] });
    wristX = progress.interpolate({ inputRange: [0, 1], outputRange: [90, 80] });
    wristY = progress.interpolate({ inputRange: [0, 1], outputRange: [90, 140] });

    hipX = new Animated.Value(cX);
    hipY = progress.interpolate({ inputRange: [0, 1], outputRange: [150, 220] });

    kneeX = progress.interpolate({ inputRange: [0, 1], outputRange: [130, 110] });
    kneeY = progress.interpolate({ inputRange: [0, 1], outputRange: [220, 230] });

    ankleX = new Animated.Value(135);
    ankleY = new Animated.Value(270);

  } else if (cleanType.includes('pushup') || cleanType.includes('push up')) {
    // PUSH UP: Horizontal plank setup. Lowering chest to floor.
    // Feet fixed on left side, head on right side.
    ankleX = new Animated.Value(60);
    ankleY = new Animated.Value(230);

    kneeX = new Animated.Value(100);
    kneeY = new Animated.Value(220);

    hipX = new Animated.Value(150);
    hipY = progress.interpolate({ inputRange: [0, 1], outputRange: [195, 215] });

    shoulderX = new Animated.Value(220);
    shoulderY = progress.interpolate({ inputRange: [0, 1], outputRange: [170, 210] });

    headX = new Animated.Value(245);
    headY = progress.interpolate({ inputRange: [0, 1], outputRange: [155, 195] });

    // Elbow bent outwards
    elbowX = progress.interpolate({ inputRange: [0, 1], outputRange: [205, 180] });
    elbowY = progress.interpolate({ inputRange: [0, 1], outputRange: [195, 235] });

    wristX = new Animated.Value(218);
    wristY = new Animated.Value(225);

  } else if (cleanType.includes('deadlift')) {
    // DEADLIFT: Hinging at hips. Start stand (0) to bent hinge (1)
    ankleX = new Animated.Value(130);
    ankleY = new Animated.Value(270);

    kneeX = progress.interpolate({ inputRange: [0, 1], outputRange: [130, 115] });
    kneeY = progress.interpolate({ inputRange: [0, 1], outputRange: [210, 225] });

    hipX = progress.interpolate({ inputRange: [0, 1], outputRange: [140, 100] });
    hipY = progress.interpolate({ inputRange: [0, 1], outputRange: [150, 185] });

    shoulderX = progress.interpolate({ inputRange: [0, 1], outputRange: [140, 150] });
    shoulderY = progress.interpolate({ inputRange: [0, 1], outputRange: [80, 125] });

    headX = progress.interpolate({ inputRange: [0, 1], outputRange: [140, 170] });
    headY = progress.interpolate({ inputRange: [0, 1], outputRange: [45, 95] });

    // Arms hang straight down holding bar
    elbowX = progress.interpolate({ inputRange: [0, 1], outputRange: [140, 150] });
    elbowY = progress.interpolate({ inputRange: [0, 1], outputRange: [115, 160] });

    wristX = progress.interpolate({ inputRange: [0, 1], outputRange: [140, 150] });
    wristY = progress.interpolate({ inputRange: [0, 1], outputRange: [150, 195] });

  } else if (cleanType.includes('plank')) {
    // PLANK: Static line with minor micro-oscillations
    ankleX = new Animated.Value(60);
    ankleY = new Animated.Value(220);

    kneeX = new Animated.Value(105);
    kneeY = new Animated.Value(210);

    hipX = new Animated.Value(155);
    hipY = progress.interpolate({ inputRange: [0, 1], outputRange: [198, 202] });

    shoulderX = new Animated.Value(215);
    shoulderY = new Animated.Value(190);

    headX = new Animated.Value(240);
    headY = new Animated.Value(180);

    // Elbows on ground
    elbowX = new Animated.Value(215);
    elbowY = new Animated.Value(220);

    wristX = new Animated.Value(235);
    wristY = new Animated.Value(220);

  } else if (cleanType.includes('lunge')) {
    // LUNGE: Standing (0) to lunge down (1)
    headX = new Animated.Value(cX);
    headY = progress.interpolate({ inputRange: [0, 1], outputRange: [50, 100] });

    shoulderX = new Animated.Value(cX);
    shoulderY = progress.interpolate({ inputRange: [0, 1], outputRange: [80, 130] });

    elbowX = new Animated.Value(cX + 20);
    elbowY = progress.interpolate({ inputRange: [0, 1], outputRange: [100, 150] });
    wristX = new Animated.Value(cX + 10);
    wristY = progress.interpolate({ inputRange: [0, 1], outputRange: [120, 170] });

    hipX = new Animated.Value(cX);
    hipY = progress.interpolate({ inputRange: [0, 1], outputRange: [150, 200] });

    // Front leg steps right, back leg drops left
    kneeX = progress.interpolate({ inputRange: [0, 1], outputRange: [130, 190] });
    kneeY = progress.interpolate({ inputRange: [0, 1], outputRange: [210, 210] });

    ankleX = progress.interpolate({ inputRange: [0, 1], outputRange: [130, 190] });
    ankleY = new Animated.Value(270);

  } else {
    // DEFAULT/OTHER (e.g. general arm movements, jumping jacks style)
    headX = new Animated.Value(cX);
    headY = new Animated.Value(60);

    shoulderX = new Animated.Value(cX);
    shoulderY = new Animated.Value(90);

    elbowX = progress.interpolate({ inputRange: [0, 1], outputRange: [120, 110] });
    elbowY = progress.interpolate({ inputRange: [0, 1], outputRange: [110, 80] });

    wristX = progress.interpolate({ inputRange: [0, 1], outputRange: [100, 80] });
    wristY = progress.interpolate({ inputRange: [0, 1], outputRange: [130, 60] });

    hipX = new Animated.Value(cX);
    hipY = new Animated.Value(160);

    kneeX = new Animated.Value(cX - 20);
    kneeY = new Animated.Value(220);

    ankleX = new Animated.Value(cX - 20);
    ankleY = new Animated.Value(270);
  }

  // Define secondary legs/arms for full figure rendering
  // (We mirror them slightly with an offset to give a 3D skeleton feel)
  const leftColor = COLORS.cyan;
  const rightColor = 'rgba(0, 212, 184, 0.45)';

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width="100%" height="100%" viewBox="0 0 300 300">
        {/* Head */}
        <AnimatedCircle
          cx={headX}
          cy={headY}
          r="16"
          stroke={leftColor}
          strokeWidth="3.5"
          fill={COLORS.bg}
        />

        {/* Spine/Torso */}
        <AnimatedLine
          x1={shoulderX}
          y1={shoulderY}
          x2={hipX}
          y2={hipY}
          stroke={leftColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Neck connector */}
        <AnimatedLine
          x1={shoulderX}
          y1={shoulderY}
          x2={headX}
          y2={headY}
          stroke={leftColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left Arm (Primary) */}
        <AnimatedLine
          x1={shoulderX}
          y1={shoulderY}
          x2={elbowX}
          y2={elbowY}
          stroke={leftColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <AnimatedLine
          x1={elbowX}
          y1={elbowY}
          x2={wristX}
          y2={wristY}
          stroke={leftColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Left Leg (Primary) */}
        <AnimatedLine
          x1={hipX}
          y1={hipY}
          x2={kneeX}
          y2={kneeY}
          stroke={leftColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <AnimatedLine
          x1={kneeX}
          y1={kneeY}
          x2={ankleX}
          y2={ankleY}
          stroke={leftColor}
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Right Leg (Secondary/Shadowed) */}
        {cleanType.includes('squat') && (
          <>
            <AnimatedLine
              x1={hipX}
              y1={hipY}
              x2={progress.interpolate({ inputRange: [0, 1], outputRange: [170, 190] })}
              y2={kneeY}
              stroke={rightColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <AnimatedLine
              x1={progress.interpolate({ inputRange: [0, 1], outputRange: [170, 190] })}
              y1={kneeY}
              x2="165"
              y2="270"
              stroke={rightColor}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Joint Highlights */}
        <AnimatedCircle cx={shoulderX} cy={shoulderY} r="5" fill={COLORS.white} />
        <AnimatedCircle cx={hipX} cy={hipY} r="5" fill={COLORS.white} />
        <AnimatedCircle cx={kneeX} cy={kneeY} r="5.5" fill={COLORS.white} />
        <AnimatedCircle cx={elbowX} cy={elbowY} r="4" fill={COLORS.white} />
        <AnimatedCircle cx={wristX} cy={wristY} r="4" fill={COLORS.white} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10, 12, 15, 0.55)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
