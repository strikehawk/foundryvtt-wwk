export class SystemValue {
    /**
     * @property The unique identifier of the value within the system.
     * 
     * @type {string}
     * @memberof SystemValue
     */
    id;

    /**
     * @property The user-friendly name of the value.
     * 
     * @type {string}
     * @memberof SystemValue
     */
    label;

    /**
     * @property Optional. The type of value: 'numerical', 'roll-expression'. Default is 'numerical'.
     * 
     * @type {string}
     * @memberof SystemValue
     */
    type;
}

export class ValueModifier {
    /**
     * @property The unique identifier of the value affected by the modifier.
     * 
     * @type {string}
     * @memberof ValueModifier
     */
    valueId;
}

export class WWKSettings {
    /**
     * @property The name of the folder containing the system.
     * 
     * @type {string}
     * @memberof WWKSettings
     */
    systemFolder;

    /**
     * @property The set of Skills used within the system, and their translation key.
     * 
     * @type {Object}
     * @memberof WWKSettings
     */
    skills;

    /**
     * @property The list of values supported by the game system.
     * 
     * @type {Map<string, SystemValue>}
     * @memberof WWKSettings
     */
    values;
}