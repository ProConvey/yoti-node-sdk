'use strict';

const WantedAttribute = require('./wanted.attribute');
const Validation = require('../../yoti_common/validation');

/**
 * Defines the list of wanted attributes for the Share session Policy.
 *
 * @class Policy
 */
module.exports = class Policy {
  /**
   * @param {WantedAttribute[]} wantedAttributes - array of attributes to be requested.
   * @param {number[]} wantedAuthTypes - auth types represents the authentication type to be used.
   * @param {boolean} wantedRememberMe
   * @param {object} identityProfileRequirements
   */
  constructor(
    wantedAttributes,
    wantedAuthTypes,
    wantedRememberMe = false,
    identityProfileRequirements = null
  ) {
    Validation.isArrayOfType(wantedAttributes, WantedAttribute, 'wantedAttribute');
    /** @private */
    this.wantedAttributes = wantedAttributes;

    if (wantedAuthTypes) {
      Validation.isArrayOfIntegers(wantedAuthTypes, 'wantedAuthTypes');
      /** @private */
      this.wantedAuthTypes = wantedAuthTypes;
    } else {
      /** @private */
      this.wantedAuthTypes = [];
    }

    Validation.isBoolean(wantedRememberMe, 'wantedRememberMe');
    /** @private */
    this.wantedRememberMe = wantedRememberMe;

    if (identityProfileRequirements) {
      Validation.isPlainObject(identityProfileRequirements, 'identityProfileRequirements');
      /** @private */
      this.identityProfileRequirements = identityProfileRequirements;
    }
  }

  /**
   * @returns {WantedAttribute[]} array of attributes to be requested.
   */
  getWantedAttributes() {
    return this.wantedAttributes;
  }

  /**
   * @returns {number[]} auth types represents the authentication type to be used.
   */
  getWantedAuthTypes() {
    return this.wantedAuthTypes;
  }

  /**
   * @returns {boolean}
   */
  getWantedRememberMe() {
    return this.wantedRememberMe;
  }

  /**
   * @return {Object}
   */
  getIdentityProfileRequirements() {
    return this.identityProfileRequirements;
  }

  /**
   * @returns {Object} data for JSON.stringify()
   */
  toJSON() {
    const base = {
      wanted: this.getWantedAttributes(),
      wanted_auth_types: this.getWantedAuthTypes(),
      wanted_remember_me: this.getWantedRememberMe(),
      wanted_remember_me_optional: false,
    };
    const identityProfileRequirements = this.getIdentityProfileRequirements();
    if (identityProfileRequirements) {
      return Object.assign(base, { identity_profile_requirements: identityProfileRequirements });
    }
    return base;
  }
};
