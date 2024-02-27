<template>
  <main>
    <Header/>

    <div class="container my-5">
      <form>
        <div class="row">

          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-12">
                    <button type="reset" class="btn btn-light float-start">Suche zurücksetzen</button>
                    <button type="button" class="btn btn-primary float-end" @click="searchClassifieds">Jetzt Suchen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12 mt-4" v-for="property in properties">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title pb-2 border-bottom">{{ property.name }}</h4>

                <div class="row">

                  <template v-for="groupOption in property.groupOptions">
                    <template v-if="groupOption.type === 'checkbox'">
                      <div class="col-md-3 col-sm-6">
                        <div class="mb-3 form-check">
                          <input type="checkbox"
                                 class="form-check-input"
                                 :value="groupOption.id"
                                 :id="`checkbox-${groupOption.id}`"
                                 v-model="checkboxIds">
                          <label class="form-check-label" :for="`checkbox-${groupOption.id}`">{{
                              groupOption.name
                            }}</label>
                        </div>
                      </div>
                    </template>

                    <template v-if="groupOption.type === 'select' && groupOption.name === 'Marke'">
                      <div class="col-md-4 col-sm-6">
                        <div class="input-group mb-3">
                          <span class="input-group-text">{{ groupOption.name }}</span>
                          <select :id="`select-${groupOption.id}`"
                                  class="form-select"
                                  v-model="selectedBrand"
                          >
                            <option value="">beliebig</option>
                            <option v-for="optionValue in groupOption.optionValues"
                                    :value="optionValue">
                              {{ optionValue.value }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </template>

                    <template v-if="groupOption.type === 'select' && groupOption.name === 'Modell'">
                      <div class="col-md-4 col-sm-6">
                        <div class="input-group mb-3">
                          <span class="input-group-text">{{ groupOption.name }}</span>
                          <select :id="`select-${groupOption.id}`"
                                  :disabled="possibleModels.length === 0"
                                  class="form-select"
                                  v-model="selectedModel"
                          >
                            <option value="">beliebig</option>
                            <template v-if="possibleModels"
                                      v-for="groupOptionValue in possibleModels">

                              <option v-if="groupOptionValue.childName"
                                      :label="groupOptionValue.childName"
                                      :value="groupOptionValue.id">
                                {{ groupOptionValue.childName }}
                              </option>

                              <option v-if="groupOptionValue.values"
                                      v-for="childValue in groupOptionValue.values"
                                      :label="childValue.value"
                                      :value="childValue.id">
                                {{ childValue.value }}
                              </option>

                              <option v-if="groupOptionValue.value"
                                      :label="groupOptionValue.value"
                                      :value="groupOptionValue.id">
                                {{ groupOptionValue.value }}
                              </option>

                            </template>
                          </select>
                        </div>
                      </div>
                    </template>

                    <template v-if="groupOption.type === 'select'
                    && groupOption.name !== 'Marke'
                    && groupOption.name !== 'Modell'">
                      <div class="col-md-4 col-sm-6">
                        <div class="input-group mb-3">
                          <span class="input-group-text">{{ groupOption.name }}</span>
                          <select :id="`select-${groupOption.id}`"
                                  class="form-select"
                                  v-model="groupOption.selectFrom">
                            <option value="">beliebig</option>
                            <option v-for="optionValue in groupOption.optionValues"
                                    :value="optionValue.id">
                              {{ optionValue.value }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </template>

                    <template v-if="groupOption.type === 'selectRange'">
                      <label class="fw-bold">{{ groupOption.name }}</label>

                      <div class="col-md-3 col-sm-6">
                        <div class="input-group mb-3">
                          <span class="input-group-text">von</span>
                          <select :id="`selectRange-${groupOption.id}-from`"
                                  class="form-select"
                                  v-model="groupOption.selectFrom">
                            <option value="">beliebig</option>
                            <option v-for="optionValue in groupOption.optionValues"
                                    :value="optionValue.id">
                              {{ optionValue.value }}
                            </option>
                          </select>
                        </div>
                      </div>

                      <div class="col-md-3 col-sm-6">
                        <div class="input-group mb-3">
                          <span class="input-group-text">bis</span>
                          <select :id="`selectRange-${groupOption.id}-to`"
                                  class="form-select"
                                  v-model="groupOption.selectTo">
                            <option value="">beliebig</option>
                            <option v-for="optionValue in groupOption.optionValues"
                                    :value="optionValue.id">
                              {{ optionValue.value }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </template>

                    <template v-if="groupOption.type === 'checkboxGroup'">
                      <label class="fw-bold">{{ groupOption.name }}</label>

                      <div class="col-md-3 col-sm-6" v-for="optionValue in groupOption.optionValues">
                        <div class="mb-3 form-check">
                          <input type="checkbox"
                                 class="form-check-input"
                                 :value="optionValue.id"
                                 :id="`checkbox-${groupOption.id}-option-value-${optionValue.id}`"
                                 v-model="checkboxIds">
                          <label class="form-check-label"
                                 :for="`checkbox-${groupOption.id}-option-value-${optionValue.id}`">
                            {{ optionValue.value }}
                          </label>
                        </div>
                      </div>
                    </template>
                  </template>

                  <template v-if="property.isEquipmentGroup">
                    <ul class="nav nav-tabs" :id="`tab-property-${property.id}`" role="tablist">
                      <li class="nav-item" role="presentation" v-for="(option, index) in property.groupOptions">
                        <button :class="`${index === 0 ? 'nav-link active' : 'nav-link'}`"
                                :id="`${option.id}-tab`"
                                data-bs-toggle="tab"
                                :data-bs-target="`#${option.id}-tab-pane`"
                                type="button"
                                role="tab"
                                :aria-controls="`${option.id}-tab-pane`"
                                aria-selected="false">
                          {{ option.name }}
                        </button>
                      </li>
                    </ul>
                    <div class="tab-content" :id="`tab-property-${property.id}-content`"
                         v-for="(option, index) in property.groupOptions">
                      <div :class="`${index === 0 ? 'tab-pane fade show active' : 'tab-pane fade'}`"
                           :id="`${option.id}-tab-pane`"
                           role="tabpanel"
                           :aria-labelledby="`${option.id}-tab`"
                           tabindex="0">
                        <div class="row">
                          <div class="col-md-4" v-for="optionValue in option.optionValues">
                            <div class="mb-3 form-check">
                              <input type="checkbox"
                                     class="form-check-input"
                                     :value="optionValue.id"
                                     :id="`checkbox-${option.id}-option-value-${optionValue.id}`"
                                     v-model="checkboxIds">
                              <label class="form-check-label"
                                     :for="`checkbox-${option.id}-option-value-${optionValue.id}`">
                                {{ optionValue.value }}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

      </form>

    </div>

    <div class="b-example-divider"></div>

    <Footer/>

  </main>

</template>
<script setup>
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ref, watch } from 'vue';
import {useRouter} from 'nuxt/app';

import SearchService from "../service/search.service";

const router = useRouter();
const searchService = new SearchService();

const {data: properties} = await searchService.searchProperties();

const checkboxIds = ref([]);
const selectIdsFrom = ref([]);
const selectIdsTo = ref([]);

const selectedBrand = ref([]);
const selectedModel = ref([]);

let possibleModels = ref([]);

function filterModelsByBrand(brand) {
  const filteredModels = ref([]);

  properties.forEach((property) => {
    console.log('lo property', property);

    property.groupOptions.forEach((groupOption) => {
      groupOption.optionValues.forEach((optionValue) => {
        if (property.name === 'Marke, Modell, Variante' && groupOption.name === 'Modell' && optionValue.parentName === brand) {
          filteredModels.value.push(optionValue);
        }
      });
    })
  });

  return filteredModels;
}

watch(selectedBrand, () => {
  console.log('selectedBrand changed', selectedBrand);

  // In case of no brand is selected
  // Remove the previously selected model
  if (selectedBrand.value.length === 0) {
    possibleModels = ref([]);
    selectedModel.value = [];

    return;
  }

  possibleModels = filterModelsByBrand(selectedBrand.value.value);
  selectedModel.value = [];
});


async function searchClassifieds() {
  console.log('properties', properties);

  console.log('selected brand', selectedBrand);
  console.log('selected model', selectedModel);

  properties.forEach((property) => {
    property.groupOptions.forEach((groupOption) => {
      if (groupOption.selectFrom) {
        selectIdsFrom.value.push(groupOption.selectFrom);
      }

      if (groupOption.selectTo) {
        selectIdsTo.value.push(groupOption.selectTo);
      }
    })
  });

  if (selectedBrand.value.id) {
    selectIdsFrom.value.push(selectedBrand.value.id);
  }

  if (selectedModel.value.length) {
    selectIdsFrom.value.push(selectedModel.value);
  }

  const routerQuery = ref([]);

  routerQuery.value.page = 1;

  if (checkboxIds.value.length) {
    routerQuery.value.pIds = checkboxIds.value.join(',');
  }

  if (selectIdsFrom.value.length) {
    routerQuery.value.sIdsFrom = selectIdsFrom.value.join(',');
  }

  if (selectIdsTo.value.length) {
    routerQuery.value.sIdsTo = selectIdsTo.value.join(',');
  }

  await router.push({
    name: 'listing',
    query: routerQuery.value,
  })
}
</script>