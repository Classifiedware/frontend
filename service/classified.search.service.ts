import { useRuntimeConfig } from "nuxt/app";
import { IClassified } from "~/types/classified";
import { IClassifiedOption } from "~/types/classifiedOption";

export default class ClassifiedSearchService {
    async searchClassifieds(
        page: number,
        brand: string,
        model: string,
        propertyGroupOptionIds: any,
        propertyGroupOptionIdsSelectFrom: any,
        propertyGroupOptionIdsSelectTo: any
    ): Promise<{ data: any } | { data: IClassified[] }> {
        const config = useRuntimeConfig();

        console.log('brand', brand);

        return await $fetch(`/search/classified`, {
            method: 'POST',
            baseURL: config.public.apiUrl,
            body: {
                page,
                brand,
                model,
                propertyGroupOptionIds,
                propertyGroupOptionIdsSelectFrom,
                propertyGroupOptionIdsSelectTo
            }
        })
            .then((response: any) => {
                return { data: response.data.map((data: any) => this.createClassifiedFromData(data)) };
            }).catch(() => {
                return { data: [] };
            });
    }

    createClassifiedFromData(data: any) {
        let classifiedOptions: IClassifiedOption[] = [];

        data.options.forEach((optionRow: any) => {
           const classifiedOption: IClassifiedOption = {
             optionName: optionRow.optionName,
             value: optionRow.value,
           };

           classifiedOptions.push(classifiedOption);
        });

        const classified: IClassified = {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          offerNumber: data.offerNumber,
          options: classifiedOptions,
        };

        return classified;
    }
}