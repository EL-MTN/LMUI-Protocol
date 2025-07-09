# LMUI Component Specification

This document provides the detailed specification for all standard UI components supported by the **Language Model User Interface (LMUI) Protocol**.

---

## 1. Text Input

A standard single-line text field for free-form user input.

-   **`type`**: `"text_input"`

### Schema

| Property | Type   | Required | Description                     |
| :------- | :----- | :------- | :------------------------------ |
| `type`   | String | Yes      | Must be `"text_input"`.         |
| `id`     | String | Yes      | A unique identifier for the component. |
| `label`  | String | Yes      | The text label displayed to the user. |

### Return Value

When submitted in a form, this component's value is included in the `values` object.

-   **Type**: `String`
-   **Description**: The text content entered by the user.

### Example

```json
{
    "type": "text_input",
    "id": "departure_city",
    "label": "Departure City"
}
```

---

## 2. Select (Dropdown)

A dropdown menu that allows users to select one option from a predefined list.

-   **`type`**: `"interactive_select"`

### Schema

| Property | Type            | Required | Description                                     |
| :------- | :-------------- | :------- | :---------------------------------------------- |
| `type`   | String          | Yes      | Must be `"interactive_select"`.                 |
| `id`     | String          | Yes      | A unique identifier for the component.          |
| `label`  | String          | Yes      | The text label displayed to the user.           |
| `options`| Array of Objects| Yes      | An array of option objects to populate the dropdown. |

### The `options` Object

Each object in the `options` array must have the following structure:

| Property | Type   | Required | Description                               |
| :------- | :----- | :------- | :---------------------------------------- |
| `text`   | String | Yes      | The user-visible text for the option.     |
| `value`  | String | Yes      | The value sent back to the server upon selection. |

### Return Value

When submitted in a form, this component's value is included in the `values` object.

-   **Type**: `String`
-   **Description**: The `value` from the `option` object that was selected by the user.

### Example

```json
{
    "type": "interactive_select",
    "id": "travel_class",
    "label": "Travel Class",
    "options": [
        { "text": "Economy", "value": "economy" },
        { "text": "Business", "value": "business" },
        { "text": "First Class", "value": "first" }
    ]
}
```

---

## 3. Text Area

A multi-line text field for longer, free-form user input.

-   **`type`**: `"textarea"`

### Schema

| Property | Type   | Required | Description                     |
| :------- | :----- | :------- | :------------------------------ |
| `type`   | String | Yes      | Must be `"textarea"`.           |
| `id`     | String | Yes      | A unique identifier for the component. |
| `label`  | String | Yes      | The text label displayed to the user. |

### Return Value

-   **Type**: `String`
-   **Description**: The text content entered by the user.

### Example

```json
{
    "type": "textarea",
    "id": "special_requests",
    "label": "Special Requests (e.g., dietary needs, assistance)"
}
```

---

## 4. Checkbox Group

A group of checkboxes that allows users to select multiple options from a list.

-   **`type`**: `"checkbox_group"`

### Schema

| Property | Type            | Required | Description                                  |
| :------- | :-------------- | :------- | :------------------------------------------- |
| `type`   | String          | Yes      | Must be `"checkbox_group"`.                  |
| `id`     | String          | Yes      | A unique identifier for the entire group.    |
| `label`  | String          | Yes      | The text label displayed for the group.      |
| `options`| Array of Objects| Yes      | An array of option objects for the checkboxes. |

### The `options` Object

*Identical to the `options` object for the `interactive_select` component.*

### Return Value

-   **Type**: `Array<String>`
-   **Description**: An array containing the `value` of each `option` that was selected by the user.

### Example

```json
{
    "type": "checkbox_group",
    "id": "add_ons",
    "label": "Additional Services:",
    "options": [
        { "text": "Extra Legroom Seat", "value": "extra_legroom" },
        { "text": "Priority Boarding", "value": "priority_boarding" },
        { "text": "In-Flight Wi-Fi", "value": "wifi" }
    ]
}
```

---

## 5. Radio Button Group

A group of radio buttons that allows users to select one option from an always-visible list.

-   **`type`**: `"radio_button_group"`

### Schema

| Property | Type            | Required | Description                                 |
| :------- | :-------------- | :------- | :------------------------------------------ |
| `type`   | String          | Yes      | Must be `"radio_button_group"`.             |
| `id`     | String          | Yes      | A unique identifier for the entire group.   |
| `label`  | String          | Yes      | The text label displayed for the group.     |
| `options`| Array of Objects| Yes      | An array of option objects for the radio buttons. |

### The `options` Object

*Identical to the `options` object for the `interactive_select` component.*

### Return Value

-   **Type**: `String`
-   **Description**: The `value` from the one `option` object that was selected by the user.

### Example

```json
{
    "type": "radio_button_group",
    "id": "seating_preference",
    "label": "Seating Preference:",
    "options": [
        { "text": "Window", "value": "window" },
        { "text": "Aisle", "value": "aisle" }
    ]
}
```

---

## 6. Slider

Allows the user to select a numerical value from a stepped range.

-   **`type`**: `"slider"`

### Schema

| Property | Type   | Required | Description                                    |
| :------- | :----- | :------- | :--------------------------------------------- |
| `type`   | String | Yes      | Must be `"slider"`.                            |
| `id`     | String | Yes      | A unique identifier for the component.         |
| `label`  | String | Yes      | The text label displayed to the user.          |
| `min`    | Number | Yes      | The minimum value of the slider.               |
| `max`    | Number | Yes      | The maximum value of the slider.               |
| `step`   | Number | Yes      | The increment between selectable values.       |

### Return Value

-   **Type**: `Number`
-   **Description**: The numerical value selected by the user.

### Example

```json
{
    "type": "slider",
    "id": "max_layover_hours",
    "label": "Maximum Layover (hours):",
    "min": 0,
    "max": 12,
    "step": 1
}
```

---

## 7. Static Markdown

Renders a block of Markdown text. This is a non-interactive component, useful for providing richly formatted instructions, links, or other information within a form.

-   **`type`**: `"static_markdown"`

### Schema

| Property | Type   | Required | Description                                   |
| :------- | :----- | :------- | :-------------------------------------------- |
| `type`   | String | Yes      | Must be `"static_markdown"`.                  |
| `id`     | String | Yes      | A unique identifier for the component.        |
| `content`| String | Yes      | A string containing the Markdown to be rendered. |

### Return Value

-   **Type**: `null`
-   **Description**: This component is non-interactive and does not return a value.

### Example

```json
{
    "type": "static_markdown",
    "id": "baggage_info",
    "content": "### Important Baggage Information\n\nPlease note that the standard checked baggage allowance is **1 bag (23kg)**. Additional bags may incur extra fees."
}
```

---

## 8. Proposed Future Components

The LMUI protocol is designed for extensibility. The following components are proposed for future versions of the specification to support even richer interactive scenarios.

| Component Type         | Description                                                                 | Expected Return Value                                         |
| :--------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------ |
| `date_picker`          | A calendar-based interface for selecting a single date.                     | `String` (ISO 8601 Format: `YYYY-MM-DD`)                      |
| `date_range_picker`    | A calendar-based interface for selecting a start and end date.              | `Object` (e.g., `{ "start": "YYYY-MM-DD", "end": "..." }`) |
| `file_upload`          | A component that allows the user to upload a file to the server.            | `Object` (e.g., `{ "file_id": "...", "name": "..." }`)*     |
| `button`               | A standalone button that can trigger a specific, non-form-submission event. | `null` (Triggers an event, does not return a value in a form) |
| `image`                | Displays a static image, specified by a URL.                                | `null` (Non-interactive)                                      |

_*Note on `file_upload`: The file upload process itself would require a separate protocol mechanism (e.g., the server providing a pre-signed URL for a direct upload). The return value in the form submission would be a confirmation record containing metadata about the uploaded file._ 