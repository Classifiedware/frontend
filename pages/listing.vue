<template>
  <main>
    <Header/>

    <div class="album py-5 bg-light">
      <div class="container">
        <form>

        <div class="row">
          <div class="col-sm-4">
            <div class="card">
              <div class="card-body">
                <h3 class="card-title">Suche</h3>

                <div class="list-group w-auto">

                  <template v-for="property in properties">

                    <h6 class="card-title pb-2 border-bottom">{{ property.name }}</h6>


                    <div class="row">
                    <template v-for="groupOption in property.groupOptions">
                      <template v-if="groupOption.type === 'select'">
                        <div class="col-md-12 col-sm-6">
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

                      <template v-if="groupOption.type === 'checkbox'">
                        <div class="col-md-6 col-sm-6">
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

                      <template v-if="groupOption.type === 'selectRange'">
                        <label class="fw-bold">{{ groupOption.name }}</label>

                        <div class="col-md-6 col-sm-6">
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

                        <div class="col-md-6 col-sm-6">
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

                        <div class="col-md-6 col-sm-6" v-for="optionValue in groupOption.optionValues">
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
                              <div class="col-md-6 col-sm-6" v-for="optionValue in option.optionValues">
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

                  </template>

                  <div class="row">
                    <div class="col-md-12">
                      <button type="button" class="btn btn-primary float-end" @click="searchClassifieds">Jetzt Suchen</button>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="card mb-3" v-for="classified in classifieds.data">
              <div class="card-body">
                <div class="row">
                  <div class="col-4">
                    <div class="classified-image-block">
                      <img class="img-responsive"
                           :src="`https://via.placeholder.com/240x180.png?text=${classified.name}`"
                           :alt="classified.name">
                    </div>
                  </div>

                  <div class="col-8">
                    <div class="row">
                      <div class="col-7">
                        <div class="classified-title-block">
                          <span class="h3 text-break">{{ classified.name }}</span>
                        </div>
                      </div>

                      <div class="col-5">
                        <div class="classified-price-block">
                          <span class="h3">{{ classified.price }} €</span>
                        </div>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-12">
                        <div class="row">
                          <div class="col-md-6" v-for="option in classified.options">
                            <template v-if="option.value !== true && option.value !== false">
                              {{ option.optionName }}: {{ option.value }}
                            </template>

                            <template v-else>
                              {{ option.optionName }}
                            </template>
                          </div>
                        </div>
                      </div>

                      <div class="col-12 mt-2">
                        <div class="row">
                          <div class="col-2">
                            <div class="dealer-logo-block">
                              <div class="dealer-image-wrapper">
                                <img class="img-responsive" src="https://via.placeholder.com/80x35.png?text=Test+Dealer" alt="Dealer Logo">
                              </div>
                            </div>
                          </div>
                          <div class="col-10">
                            <span class="dealer-name">Händler Test</span>
                          </div>
                          <div class="col-10">
                            Tel.: + 49 (0)100 12345678
                            <br>
                            DE-12345 Test, Händler
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        </form>

      </div>
    </div>

    <div class="b-example-divider"></div>

    <Footer/>

  </main>

</template>
<script setup>
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ref} from 'vue';
import { useRoute, useRouter, useAsyncData } from 'nuxt/app';

import SearchService from "../service/search.service";
import ClassifiedSearchService from "../service/classified.search.service";

const route = useRoute();
const router = useRouter();

const searchService = new SearchService();
const classifiedSearchService = new ClassifiedSearchService();

const {data: properties} = await searchService.searchProperties();

const page = ref(1);
const checkboxIds = ref([]);
const selectIdsFrom = ref([]);
const selectIdsTo = ref([]);

if (route.query['page']) {
    page.value = parseInt(route.query['page']);
}

if (route.query['pIds']) {
  checkboxIds.value = route.query['pIds'].split(',');
}

if (route.query['sIdsFrom']) {
  selectIdsFrom.value = route.query['sIdsFrom'].split(',');
}

if (route.query['sIdsTo']) {
  selectIdsTo.value = route.query['sIdsTo'].split(',');
}

function setSelectGroupOptionsFromQuery() {
  properties.forEach((property) => {
    property.groupOptions.forEach((groupOption) => {
      groupOption.optionValues.forEach((optionValue) => {
        selectIdsFrom.value.forEach((selectId) => {
          if (selectId === optionValue.id) {
            groupOption.selectFrom = optionValue.id;
          }
        });

        selectIdsTo.value.forEach((selectId) => {
          if (selectId === optionValue.id) {
            groupOption.selectTo = optionValue.id;
          }
        });
      })
    })
  });
}

function getSelectIdsForSearchFromGroupOptions() {
  const selectIdsFrom = ref([]);
  const selectIdsTo = ref([]);

  properties.forEach((property) => {
    property.groupOptions.forEach((groupOption) => {
      if (groupOption.selectFrom && !selectIdsFrom.value.includes(groupOption.selectFrom)) {
        selectIdsFrom.value.push(groupOption.selectFrom);
      }

      if (groupOption.selectTo && !selectIdsTo.value.includes(groupOption.selectTo)) {
        selectIdsTo.value.push(groupOption.selectTo);
      }
    })
  });

  return {
    from: selectIdsFrom,
    to: selectIdsTo,
  }
}

setSelectGroupOptionsFromQuery();

async function searchClassifieds() {
  const routerQuery = ref([]);

  if (page.value) {
      routerQuery.value.page = page.value;
  }

  if (checkboxIds.value.length) {
    routerQuery.value.pIds = checkboxIds.value.join(',');
  }

  const selectIdsForSearch = getSelectIdsForSearchFromGroupOptions();

  if (selectIdsForSearch.from.value.length) {
    routerQuery.value.sIdsFrom = selectIdsForSearch.from.value.join(',');
  }

  if (selectIdsForSearch.to.value.length) {
    routerQuery.value.sIdsTo = selectIdsForSearch.to.value.join(',');
  }

  await navigateTo({
    path: '/listing',
    replace: true,
    query: routerQuery.value,
  });

  const { data: classifieds } = await useAsyncData(
      'classifieds',
      () => classifiedSearchService.searchClassifieds(
          page.value,
          checkboxIds.value,
          selectIdsForSearch.from.value,
          selectIdsForSearch.to.value
      ),
  );
}

// Initialize classifieds on page load
const { data: classifieds } = await useAsyncData(
    'classifieds',
    () => classifiedSearchService.searchClassifieds(
        page.value,
        checkboxIds.value,
        selectIdsFrom.value,
        selectIdsTo.value
    ),
);
</script>