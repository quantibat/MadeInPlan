<template>
<div>
    <el-row type="flex" align="bottom" class="header">
        <h1>Mon terrain</h1>
    </el-row>
    <el-row class="credit-container">
        <el-tabs type="card" id="1" value="1" @tab-click="handleClick">
            <el-tab-pane name="1" >
                <span slot="label">Trouver un terrain</span>
                <terrain-form />
            </el-tab-pane>
            <el-tab-pane id="2" name="2" >
                <span slot="label">Comparer mes terrains</span>
                <compare-terrain/>
            </el-tab-pane>
            <el-tab-pane id="3" name="3">
                <span slot="label">Mes Contacts</span>
                    <el-row type="flex" :gutter="48">
                        <el-col :span="18">
                            <table class="contacts-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Prénom</th>
                                        <th>Téléphone</th>
                                        <th style="width: 100% !important">Email</th>
                                        <th style="width: 100% !important">Localisation</th>
                                        <th style="width: 4rem !important;position: relative; right: 0.5rem;"></th>
                                    </tr>
                                </thead>
                            </table>

                            <table class="contacts-table add" @click="addContact">
                                <tbody>
                                    <tr><td>+ Ajouter un contact</td></tr>
                                </tbody>
                            </table>

                            <table v-for="(contact, index) in contacts" class="contacts-table details" :key="contact._id">
                                <tbody>
                                    <tr>
                                        <td class="input-container">
                                            <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'name')" placeholder="Nom" contenteditable v-html="contact.name"></div>
                                        </td>
                                        <td class="input-container">
                                            <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'firstName')" placeholder="Prénom" contenteditable v-html="contact.firstName"></div>
                                        </td>
                                        <td class="input-container">
                                            <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'phoneNumber')" placeholder="Téléphone" contenteditable v-html="contact.phoneNumber"></div>
                                        </td>
                                        <td class="input-container" style="width: 100% !important">
                                            <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'email')" placeholder="Email" contenteditable v-html="contact.email"></div>
                                        </td>
                                        <td class="input-container" style="width: 100% !important">
                                            <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'localisation')" placeholder="Localisation" contenteditable v-html="contact.localisation"></div>
                                        </td>
                                        <td style="width: 4rem;position: relative; right: 0.5rem;">
                                            <div style="float: right;" :class="(contact.deletable)?'contact-table-delete deletable':'contact-table-delete'">
                                                <el-popover placement="top" trigger="click" :value="popOverIndex === index">
                                                    <el-row type="flex" justify="center">
                                                        <span class="remove-title">Êtes-vous sûr ?</span>
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button type="secondary" size="mini" class="remove-cancel" @click="dismissItem()">Annuler</el-button>
                                                        <el-button type="danger" size="mini" class="remove-validate" @click="deleteItem(index)">Supprimer</el-button>
                                                    </el-row>
                                                    <i slot="reference" @click="openPopOver(index)" class="budicon budicon-trash"></i>
                                                </el-popover>
                                            </div>
                                            <div :class="getNoteClass(contact)" style="float: right">
                                                <el-popover placement="top" width="400" trigger="click">
                                                    <el-input class="contact-table-note--textarea" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Saisissez votre note" v-model="contact.note" @blur="(e) => updateNote(e, index)"></el-input>
                                                    <i slot="reference" style="font-size:17px" class="budicon budicon-note-tick"></i>
                                                </el-popover>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table v-if="contactNbr == 0" class="contacts-table details">
                                <tbody>
                                    <tr>
                                        <td class="input-container">
                                            <div class="table-input-example">Kenobi</div>
                                        </td>
                                        <td class="input-container">
                                            <div class="table-input-example">Obi-Wan</div>
                                        </td>
                                        <td class="input-container">
                                            <div class="table-input-example">0611223344</div>
                                        </td>
                                        <td class="input-container" style="width: 100% !important">
                                            <div class="table-input-example">o.kenobi@starwars.fr</div>
                                        </td>
                                        <td class="input-container" style="width: 100% !important">
                                            <div class="table-input-example">Galaxie lointaine</div>
                                        </td>
                                        <td style="width: 4rem;position: relative; right: 0.5rem;"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </el-col>

                        <el-col :span="6">
                            <aside class="summary">
                                <span class="summary-count">{{contactNbr}}</span>
                                <div class="summary-label">{{(contactNbr > 1)?'contacts ajoutés':'contact ajouté'}}</div>
                            </aside>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-row>
    </div>
</template>

<script>
import FindTerrain from './../../Components/Terrain/FindTerrain.vue'
import CompareTerrain from './../../Components/Terrain/CompareTerrain.vue'

export default {
    name: 'Terrain',
    components: {
        'terrain-form': FindTerrain,
        'compare-terrain': CompareTerrain,
    },
    data() {
        return {
            contactNbr: 0,
            contacts: [],
            popOverIndex: -1,
            loading: true,
        }
    },
    computed: {
        currentObjectif() {
            return this.$store.state.currentObjectif;
        }
    },
    created() {
    },
    mounted() {
    },
    destroyed() {
    },
    watch: {
    },
    mounted() {
        this.$http.get(this.$root.URL + '/contact/get/terrain').then(res => {
            this.contacts = res.data.sort((a,b) => {
                if (a.deletable && !b.deletable)
                return -1;
                else if (!a.deletable && b.deletable)
                return 1;
                else if (a.deletable && b.deletable)
                return 0;
                else
                return 0;
            });
            this.updateContactNbr();
        }, err => {});
    },
    methods: {
        getNoteClass(contact) {
            if (contact.note == '') return 'contact-table-note-written'
            else return 'contact-table-note-written visible'
        },
        updateNote(e, index) {
            this.editKeyValue(e, index, 'note');
        },
        updateContactNbr() {
            let nbr = 0;
            // let nbr = this.contacts.filter((item) => item.deletable).length;
            let defaultContacts = this.contacts.filter((item) => !item.deletable);
            this.contacts.forEach((contact) => {
                if (contact.firstName !== '' || contact.name !== '' || contact.email !== '' || contact.phoneNumber !== '' || contact.localisation !== '')
                nbr++;
            });
            this.contactNbr = nbr;
        },
        editKeyValue(e, index, field) {
            let tmp = {
                firstName: new String(this.contacts[index].firstName),
                name: new String(this.contacts[index].name),
                email: new String(this.contacts[index].email),
                phoneNumber: new String(this.contacts[index].phoneNumber),
                localisation: new String(this.contacts[index].localisation),
                deletable: this.contacts[index].deletable,
                note: new String(this.contacts[index].note),
                _id: this.contacts[index]._id,
                _ref: "terrain"
            };
            if (field !== 'note' && field !== 'contactType')
            tmp[field] = e.target.textContent;
            else if (field !== 'contactType')
            tmp[field] = e.target.value;
            else {
                tmp[field] = e;
                this.contacts[index].contactType = e;
            }
            this.$http.post(this.$root.URL + '/contact/save', tmp).then(res => {
                if (field !== 'contactType')
                this.contacts[index] = res.data;
                this.updateContactNbr();
                this.$forceUpdate();
            }, err => {});
        },
        openPopOver(index) {
            this.popOverIndex = index;
        },
        dismissItem() {
            this.popOverIndex = -1;
        },
        deleteItem(index) {
            this.popOverIndex = -1;
            this.$http.post(this.$root.URL + '/contact/delete', this.contacts[index]).then(res => {
                if (res.data.success)
                    this.contacts.splice(index, 1);
                this.updateContactNbr();
                this.$message.success("Votre contact a bien été supprimé");
            }, err => {});
        },
        addContact() {
            const basis = {
                firstName: '',
                localisation: '',
                name: '',
                email: '',
                phoneNumber: '',
                deletable: true,
                note: '',
                _ref: "terrain"
            }
            this.$http.post(this.$root.URL + '/contact/add', basis).then(res => {
                this.contacts.unshift(res.data);
                this.updateContactNbr();
                
            }, err => {});
        },
        handleClick(tab) {
            if (tab.$el.id == "pane-1") {
                this.$root.$el.offsetParent.style.overflow= 'hidden';
            } else {
                this.$root.$el.offsetParent.style.overflow= 'auto';
            }
        }
    },
    directives: {
    }
}
</script>

<style scoped>
    [contenteditable=true]:empty:before {
        content: attr(placeholder);
        color: rgba(0,0,0,0.3);
        display: block; /* For Firefox */
    }
    .credit-container {
        margin-top: -4rem;
    }

    /* CONTACT */

    .select-jobs {
        width: 100%;
    }
    .contact-table-note-written {
        visibility: hidden;
        text-align: right;
        color: rgba(33, 45, 89, .4);
        cursor: pointer;
        position: relative;
        /* right: 3rem; */
        z-index: 1;
    }

    .contact-table-note-written.visible {
        visibility: visible;
    }

    .contacts-table tbody tr:hover .contact-table-note-written {
        visibility: visible;
    }

    .contact-table-note-written--textarea .el-textarea__inner {
        border: none;
        padding: 1rem !important;
    }

    .contact-table-note-written  textarea {
        padding: 9rem;
    }
    .contact-table-note-written  i:hover {
        color: #ffce00;
    }

    .contact-table-delete {
        visibility: hidden;
        text-align: right;
        color: rgba(33, 45, 89, .4);
        position: relative;
    }
    .contacts-table tbody tr:hover .contact-table-delete.deletable {
        visibility: visible;
    }
    .contact-table-delete i:hover {
        /* font-size: 1.2em; */
        color: red !important;
    }

    .contact-table-delete i {
        font-size: 1rem;
        padding-left: 0.8rem;
        cursor: pointer;
    }
    .remove-title {
        margin-bottom: .4rem;
    }
    .input-container {
        font-size: 1em;
        width: 57% !important;
        padding-right: .3rem;
        font-weight: 600;
        color:rgba(33, 45, 89, 1);
    }
    .table-input {
        border: none;
        border-bottom-style: hidden;
    }

    .table-input-example {
        color: rgba(0,0,0,0.3);;
        border: none;
        border-bottom-style: hidden;
    }

    table .table-input-example {
        font-weight: 400;
        background: transparent;
    }

    table .table-input {
        font-weight: 400;
        background: transparent;
    }



    .credit-container {
        margin-top: -3.5rem;
        margin-bottom: 2rem;
    }
    .el-tabs__content {
        overflow:initial;
    }
    .contacts-table {
        width: 99.99%;
        margin-top: 2rem;
        margin-bottom: 1rem;
        text-align: left;
        color:rgba(33, 45, 89, 1);
        border-collapse: collapse;
        table-layout: fixed;
    }

    .contacts-table thead th {
        color: rgba(33, 45, 89, .5);
        font-weight: 400;
        font-size: .9em;
        padding: 0rem .5rem;
        width: 57% !important;
        /* padding-left: 1rem; */
    }

    .contacts-table.details .contact-metier {
        /* color: #00BBFF; */
        font-weight: 600;
        font-size: 1.1rem;
        color: rgba(33, 45, 89, 1);
        width: 340px !important;
    }

    .contacts-table.details tbody td {
        font-size: .95rem;
        padding: 1rem 1rem;
        color: rgba(33, 45, 89, .7);
    }

    .contacts-table.details {
        border: 1px solid rgba(33, 45, 89, .06);
    }

    .contacts-table.details {
        margin-top: 0;
    }

    .contacts-table.details tbody {
        box-shadow: 0 3px 6px rgba(0, 0, 0, .04);
        cursor: pointer;
    }

    .contacts-table.details tbody:hover {
        box-shadow: 0 5px 5px rgba(0, 0, 0, .05);
        cursor: pointer;
    }

    .contacts-table.add {
        margin-top: 0;
        /* margin-bottom: -1rem; */
        border: 2px dashed rgba(0, 187, 255, 0.4);
    }

    .contacts-table.add:hover {
        border: 2px dashed rgba(0, 187, 255, 1);
        transition: .2s linear;
    }

    .contacts-table.add tbody {
        cursor: pointer;
        border-radius: 5px;
    }

    .contacts-table.add tbody td {
        font-size: .95rem;
        padding: 1rem;
        text-align: center;
        color: #00BBFF;
        border-radius: 5px;
    }

    .contacts-table.details tbody tr:hover .table-input {
        border-bottom: 1px solid rgba(33, 45, 89, .15);
        width: 100%;
    }

    .contacts-table.details tbody tr:hover .table-input:hover {
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
        cursor: text;
    }

    .table-input {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .1);
        width: 100%;
    }

    .table-input:active, .table-input:focus {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
    }
    .table-input:hover {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
    }

    .contacts-table.details tbody tr:hover .table-input-example {
        border-bottom: 1px solid rgba(33, 45, 89, .15);
        width: 100%;
    }

    .contacts-table.details tbody tr:hover .table-input-example:hover {
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
        cursor: text;
    }

    .table-input-example {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .1);
        width: 100%;
    }

    .table-input-example:active, .table-input-example:focus {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
    }
    .table-input-example:hover {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        border-bottom: 1px solid rgba(33, 45, 89, .3);
        width: 100%;
    }

    .summary {
        display: flex;
        flex-direction: column;
        text-align: center;
        background: rgba(33, 45, 89, .015);
        border: 1px solid rgba(33, 45, 89, .08);
        border-radius: 6px;
        padding: 2rem;
        margin-top: 4.5rem;
    }

    .summary-count {
        font-weight: 300;
        color: #00BBFF;
        font-size: 3.5rem;
        line-height: 1;
    }

    .summary-label {
        color: rgba(33, 45, 89, .5);
    }

</style>
