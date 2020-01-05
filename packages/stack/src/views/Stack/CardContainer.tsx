import * as React from 'react';
import { Animated, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { StackNavigationState } from '@react-navigation/routers';
import { Route, useTheme } from '@react-navigation/native';
import { Props as HeaderContainerProps } from '../Header/HeaderContainer';
import Card from './Card';
import FloatingHeaderHeightContext from '../../utils/FloatingHeaderHeightContext';
import { Scene, Layout, StackHeaderMode, TransitionPreset } from '../../types';

type Props = TransitionPreset & {
  index: number;
  active: boolean;
  focused: boolean;
  closing: boolean;
  layout: Layout;
  gesture: Animated.Value;
  previousScene?: Scene<Route<string>>;
  scene: Scene<Route<string>>;
  state: StackNavigationState;
  safeAreaInsetTop: number;
  safeAreaInsetRight: number;
  safeAreaInsetBottom: number;
  safeAreaInsetLeft: number;
  cardOverlayEnabled?: boolean;
  cardShadowEnabled?: boolean;
  cardStyle?: StyleProp<ViewStyle>;
  getPreviousRoute: (props: {
    route: Route<string>;
  }) => Route<string> | undefined;
  renderHeader: (props: HeaderContainerProps) => React.ReactNode;
  renderScene: (props: { route: Route<string> }) => React.ReactNode;
  onOpenRoute: (props: { route: Route<string> }) => void;
  onCloseRoute: (props: { route: Route<string> }) => void;
  onTransitionStart?: (
    props: { route: Route<string> },
    closing: boolean
  ) => void;
  onTransitionEnd?: (props: { route: Route<string> }, closing: boolean) => void;
  onPageChangeStart?: () => void;
  onPageChangeConfirm?: () => void;
  onPageChangeCancel?: () => void;
  gestureEnabled?: boolean;
  gestureResponseDistance?: {
    vertical?: number;
    horizontal?: number;
  };
  gestureVelocityImpact?: number;
  headerMode: StackHeaderMode;
  headerShown?: boolean;
  headerTransparent?: boolean;
  floatingHeaderHeight: number;
};

export default function CardContainer({
  active,
  cardOverlayEnabled,
  cardShadowEnabled,
  cardStyle,
  cardStyleInterpolator,
  closing,
  gesture,
  floatingHeaderHeight,
  focused,
  gestureDirection,
  gestureEnabled,
  gestureResponseDistance,
  gestureVelocityImpact,
  getPreviousRoute,
  headerMode,
  headerShown,
  headerStyleInterpolator,
  headerTransparent,
  index,
  layout,
  onCloseRoute,
  onOpenRoute,
  onPageChangeCancel,
  onPageChangeConfirm,
  onPageChangeStart,
  onTransitionEnd,
  onTransitionStart,
  previousScene,
  renderHeader,
  renderScene,
  safeAreaInsetBottom,
  safeAreaInsetLeft,
  safeAreaInsetRight,
  safeAreaInsetTop,
  scene,
  state,
  transitionSpec,
}: Props) {
  React.useEffect(() => {
    onPageChangeConfirm?.();
  }, [active, onPageChangeConfirm]);

  const handleOpen = () => {
    onTransitionEnd?.({ route: scene.route }, false);
    onOpenRoute({ route: scene.route });
  };

  const handleClose = () => {
    onTransitionEnd?.({ route: scene.route }, true);
    onCloseRoute({ route: scene.route });
  };

  const handleTransitionStart = ({ closing }: { closing: boolean }) => {
    if (active && closing) {
      onPageChangeConfirm?.();
    } else {
      onPageChangeCancel?.();
    }

    onTransitionStart?.({ route: scene.route }, closing);
  };

  const insets = {
    top: safeAreaInsetTop,
    right: safeAreaInsetRight,
    bottom: safeAreaInsetBottom,
    left: safeAreaInsetLeft,
  };

  const { colors } = useTheme();

  return (
    <Card
      index={index}
      gestureDirection={gestureDirection}
      layout={layout}
      insets={insets}
      gesture={gesture}
      current={scene.progress.current}
      next={scene.progress.next}
      closing={closing}
      onOpen={handleOpen}
      onClose={handleClose}
      overlayEnabled={cardOverlayEnabled}
      shadowEnabled={cardShadowEnabled}
      onTransitionStart={handleTransitionStart}
      onGestureBegin={onPageChangeStart}
      onGestureCanceled={onPageChangeCancel}
      gestureEnabled={gestureEnabled}
      gestureResponseDistance={gestureResponseDistance}
      gestureVelocityImpact={gestureVelocityImpact}
      transitionSpec={transitionSpec}
      styleInterpolator={cardStyleInterpolator}
      accessibilityElementsHidden={!focused}
      importantForAccessibility={focused ? 'auto' : 'no-hide-descendants'}
      pointerEvents="box-none"
      containerStyle={
        headerMode === 'float' && !headerTransparent && headerShown !== false
          ? { marginTop: floatingHeaderHeight }
          : null
      }
      contentStyle={[{ backgroundColor: colors.background }, cardStyle]}
      style={StyleSheet.absoluteFill}
    >
      <View style={styles.container}>
        <View style={styles.scene}>
          <FloatingHeaderHeightContext.Provider value={floatingHeaderHeight}>
            {renderScene({ route: scene.route })}
          </FloatingHeaderHeightContext.Provider>
        </View>
        {headerMode === 'screen'
          ? renderHeader({
              mode: 'screen',
              layout,
              insets,
              scenes: [previousScene, scene],
              state,
              getPreviousRoute,
              styleInterpolator: headerStyleInterpolator,
            })
          : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
  scene: {
    flex: 1,
  },
});