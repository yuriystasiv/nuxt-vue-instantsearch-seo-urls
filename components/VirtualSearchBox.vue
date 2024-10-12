<script>
// needed to prevent warning in console
// https://github.com/algolia/vue-instantsearch/issues/608#issuecomment-483555137

/*
[InstantSearch.js]: The UI state for the index "index_name" is not consistent with the widgets mounted.

This can happen when the UI state is specified via `initialUiState`, `routing` or `setUiState` but that the widgets responsible for this state were not added. This results in those query parameters not being sent to the API.

To fully reflect the state, some widgets need to be added to the index "index_name":

- `query` needs one of these widgets: "searchBox", "autocomplete", "voiceSearch"

If you do not wish to display widgets but still want to support their search parameters, you can mount "virtual widgets" that don't render anything:

```
const virtualSearchBox = connectSearchBox(() => null);

search.addWidgets([
  virtualSearchBox({ ...  })
  ]);
```

If you're using custom widgets that do set these query parameters, we recommend using connectors instead.

See https://www.algolia.com/doc/guides/building-search-ui/widgets/customize-an-existing-widget/js/#customize-the-complete-ui-of-the-widgets
*/
import { createWidgetMixin } from "vue-instantsearch/vue3/es";
import { connectSearchBox } from "instantsearch.js/es/connectors";

export default {
  mixins: [createWidgetMixin({ connector: connectSearchBox })],
  render() {
    return null;
  },
};
</script>
