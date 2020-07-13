// @flow

import type { AppState } from '../redux/redux-setup';
import type { Dimensions } from 'lib/types/media-types';
import type { DimensionsInfo } from '../redux/dimensions-updater.react';

import { createSelector } from 'reselect';

const dimensionsSelector: (state: AppState) => Dimensions = createSelector(
  (state: AppState) => state.dimensions,
  (dimensions: DimensionsInfo): Dimensions => {
    const { width, bottomInset } = dimensions;
    const height = dimensions.height - bottomInset;
    return { height, width };
  },
);

export { dimensionsSelector };
