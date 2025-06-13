<template>
    <input ref="autocomplete" 
        :placeholder="placeholder|| 'Entrez une adresse...'" 
        class="search-location"
        onfocus="value = ''"
        @change="emitInput"
        v-bind:value="value"
        v-on:input="emitInput" 
        type="text" 
        />
</template>
<script>

//  COMPOSANT "MapsInput"
//  EXEMPLE : <maps-input placeholder="Entrez une adresse" v-on:select="callback2" v-on:input="callback" v-model="testerino"/>
// placeholder: Placeholder text to replace, base one is "Entrez une adresse"
// select: Called whenever user selects a proposition, sends a place object (can be found at https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service)
// input: Called whenever the user inputs a value
// THIS COMPONENT IS COMPATIBLE WITH V-MODEL


export default {    
    name: 'MapsInput',
    props: {
        placeholder : {
            type: String,
            required: false,
        },
        value: {
            type: String,
        }
    },
    data() {
        return {
        }
    },
    mounted() {
        this.autocomplete = new google.maps.places.Autocomplete(
            (this.$refs.autocomplete),
            {types: ['(regions)']}
        );
        this.autocomplete.setComponentRestrictions({'country': ['fr']});
        this.autocomplete.addListener('place_changed', () => {
            let place = this.autocomplete.getPlace();
            var formatted_address = {};
            place.address_components.forEach(e => {
                e.types.forEach(type => {
                    if (type == "postal_code") formatted_address.postal_code = e.long_name;
                    if (type == "locality") formatted_address.locality = e.long_name;
                    if (type == "administrative_area_level_2") formatted_address.departement = e.long_name; 
                    if (type == "administrative_area_level_1") formatted_address.administrative_region = e.long_name;
                    if (type == "country") formatted_address.country = e.long_name; 
                })
            });
            this.$emit('input', place.formatted_address);
            this.$emit('select', formatted_address);
        });
    },
    methods: {
        emitInput() {
            this.$emit('input', this.value);
        }
    }
}
</script>
<style scoped>
.search-location {
    height: 40px;
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    border: solid 1px #E3E4E9;
    border-radius: 5px;
    align-items: center;
    display: flex; font-size: 15px;
    box-shadow: 0px 0px 0px #CECECE;
    transition: box-shadow 0.1s;
}
</style>
