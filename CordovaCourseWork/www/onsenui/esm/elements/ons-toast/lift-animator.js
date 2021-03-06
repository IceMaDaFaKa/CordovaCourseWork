
/*
Copyright 2013-2015 ASIAL CORPORATION

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import util from '../../ons/util.js';
import animit from '../../ons/animit.js';
import iPhoneXPatch from '../../ons/iphonex-patch.js';
import ToastAnimator from './animator.js';

/**
 * Lift-fade Toast Animator
 */
export default class LiftToastAnimator extends ToastAnimator {

  constructor({ timing = 'ease', delay = 0, duration = 0.35 } = {}) {
    super({ timing, delay, duration });
    this.bodyHeight = document.body.clientHeight; // avoid Forced Synchronous Layout
    if (iPhoneXPatch.isIPhoneXPortraitPatchActive()) {
      this.liftAmount = 'calc(100% + 34px)';
    } else if (iPhoneXPatch.isIPhoneXLandscapePatchActive()) {
      this.liftAmount = 'calc(100% + 21px)';
    } else {
      this.liftAmount = '100%';
    }
  }

  /**
   * @param {HTMLElement} toast
   * @param {Function} callback
   */
  show(toast, callback) {
    toast = toast._toast;

    animit.runAll(
      animit(toast, this.def)
        .default(
          { transform: `translate3d(0, ${this.liftAmount}, 0)`, opacity: 0 },
          { transform: 'translate3d(0, 0, 0)', opacity: 1 }
        )
        .queue(done => {
          callback && callback();
          done();
        })
      );
  }

  /**
   * @param {HTMLElement} toast
   * @param {Function} callback
   */
  hide(toast, callback) {
    toast = toast._toast;

    animit.runAll(
      animit(toast, this.def)
        .default(
          { transform: 'translate3d(0, 0, 0)', opacity: 1 },
          { transform: `translate3d(0, ${this.liftAmount}, 0)`, opacity: 0 }
        )
        .queue(done => {
          callback && callback();
          done();
        })
    );
  }

  _updatePosition(toast) {
    if (parseInt(toast.style.top, 10) === 0) {
      toast.style.top = toast.style.bottom = '';
    }
  }
}
