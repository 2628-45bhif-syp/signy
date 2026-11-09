# Spec Delta

## ADDED Requirements

### Requirement: Basic Sign Library
The system SHALL provide a Library view that loads a list of basic Austrian Sign Language (ÖGS) signs from a JSON manifest at runtime and displays each sign's German word beside a playable video, grouped by category, with the creator, a source link and a license link shown for every sign. The system SHALL serve the sign videos and poster images from the application's own origin and SHALL NOT download a sign's video until the user plays it.

#### Scenario: Library shows signs from the manifest
- **WHEN** the user opens the Library view and the manifest loads successfully
- **THEN** the system lists every sign in the manifest under its category, with its German word, a video showing its poster image, and its attribution links

#### Scenario: User plays a sign
- **WHEN** the user activates the play control of a sign
- **THEN** the system downloads and plays that sign's video on a loop without sound, and pauses it when the user activates the control again

#### Scenario: Opening the library does not fetch videos
- **WHEN** the user opens the Library view without playing any sign
- **THEN** the system requests only the manifest and poster images, and makes no request to a third-party origin

#### Scenario: Manifest cannot be loaded
- **WHEN** the manifest request fails or returns invalid data
- **THEN** the system shows a clear error message in the Library view without crashing, and the Translator view remains usable
