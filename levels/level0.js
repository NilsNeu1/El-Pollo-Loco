/**
 * Level 0 configuration.
 * Represents an empty level (used for main menu and placeholder).
 * All arrays are empty because no objects, enemies, or UI elements
 * should be rendered in this stage.
 */
const level0 = new Level(
    [], // keine Hintergrundobjekte (no background objects)
    [], // keine Wolken im Hauptmenü (no clouds in main menu)
    [], // keine sammelbaren Flaschen (no collectable bottles)
    [], // keine sammelbaren Münzen (no collectable coins)
    [], // keine Gegner (no enemies)
    []  // keine Game UI (no UI elements)
);
