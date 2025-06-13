<template>
    <div class="main-container">
        <el-row type="flex" align="bottom" class="header">
            <h1>Mes prestataires</h1>
        </el-row>
            <el-row class="credit-container">
            <el-tabs type="card" ref="tabs" :stretch="isMobile()">
                <el-tab-pane label="Mes contacts">
                    <el-row class="presta-container" type="flex" :gutter="48">
                    <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                    <el-row>
                        <table class="contacts-table">
                            <thead>
                                <tr>
                                    <el-col :xs="9" :sm="9" :md="8" :lg="9" :xl="8"><th style="padding-left: 1rem;">Métier</th></el-col>
                                    <el-col :xs="4" :sm="4" :md="5" :lg="5" :xl="5"><th>Nom</th></el-col>
                                    <el-col :xs="5" :sm="5" :md="5" :lg="4" :xl="5"><th>Email</th></el-col>
                                    <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4"><th>Téléphone</th></el-col>
                                    <el-col :span="2"><th style="width: 4rem;position: relative; right: 0.5rem;"/></el-col>
                                </tr>
                            </thead>
                        </table>
                    </el-row>
                    <table class="contacts-table add" @click="addContact">
                        <tbody>
                            <tr>
                                <td>+ Ajouter un contact</td>
                            </tr>
                        </tbody>
                    </table>
                    <el-row v-for="(contact, index) in contacts" :key="contact._id">
                        <table class="contacts-table details">
                        <tbody>
                            <tr>
                                <el-col :xs="9" :sm="9" :md="8" :lg="9" :xl="8">
                                    <td class="contact-metier input-container" v-if="contact.deletable">
                                        <el-select class="select-jobs" v-model="contact.contactType" @change="(e) => editKeyValue(e, index, 'contactType')" :disabled="!contact.deletable" filterable placeholder="Choisir un métier">
                                            <el-option
                                            v-for="item in contactTypes"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                            </el-option>
                                        </el-select>
                                    </td>
                                    <td class="contact-metier input-container" v-else>{{contact.contactType}}</td>
                                </el-col>
                                <el-col :xs="4" :sm="4" :md="5" :lg="5" :xl="5">
                                    <td class="input-container">
                                        <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'name')" placeholder="Nom" contenteditable v-html="contact.name"/>
                                    </td>
                                </el-col>
                                <el-col :xs="5" :sm="5" :md="5" :lg="4" :xl="5">
                                    <td class="input-container">
                                        <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'email')" placeholder="Email" contenteditable v-html="contact.email"/>
                                    </td>
                                </el-col>
                                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                                    <td class="input-container">
                                        <div class="table-input" onClick="document.execCommand('selectAll',false,null)" @blur="(e) => editKeyValue(e, index, 'phoneNumber')" placeholder="Téléphone" contenteditable v-html="contact.phoneNumber"/>
                                    </td>
                                </el-col>
                                <el-col :xs="2" :sm="2" :md="2" :lg="2" :xl="2">
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
                                            <el-popover
                                            placement="top"
                                            width="400"
                                            trigger="click">
                                                <el-input
                                                    class="contact-table-note--textarea"
                                                    type="textarea"
                                                    :autosize="{ minRows: 2, maxRows: 4}"
                                                    placeholder="Saisissez votre note"
                                                    v-model="contact.note"
                                                    @blur="(e) => editKeyValue(e, index, 'note')">
                                                </el-input>
                                                <i slot="reference" style="font-size:17px" class="budicon budicon-note-tick"></i>
                                            </el-popover>
                                        </div>
                                    </td>
                                </el-col>
                            </tr>
                        </tbody>

                    </table>
                    </el-row>
                    </el-col>
                    <el-col :span="6" :xl="6" :lg="6" :md="24" :sm="24" class="hidden-sm-and-down">
                        <aside class="summary">
                            <span class="summary-count">{{contactNbr}}</span>
                            <div class="summary-label">{{(contactNbr > 1)?'contacts ajoutés':'contact ajouté'}}</div>
                        </aside>
                    </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="Prestataires">
                    <div style=" display: flex; align-items: center;position:absolute; left: 0; right: 0; top: 0; bottom: 0; background: rgba(255, 255, 255, .8); z-index: 1000">
                        <div class="prestataire-remove">
                        Ici, bientôt tous nos <span style="color: #00BBFF; font-weight: 600;">meilleurs prestataires</span>
                        </div>
                    </div>
                     <el-row class="presta-container" style="position: relative;" type="flex" :gutter="48">

                        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/36.jpg">
                                <h3 class="presta-card--title">Yannick M.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Montpellier — Hérault</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Maçon</div>

                                    <div class="presta-card--metier">Couvreur</div>
                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/20.jpg">
                                <h3 class="presta-card--title">Cédric S.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Nanterre - Hauts-de-Seine</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Thermicien</div>
                
                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                        <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/22.jpg">
                                <h3 class="presta-card--title">Stéphan L.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Reims — Marne</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Plaquiste</div>

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/68.jpg">
                                <h3 class="presta-card--title">Stéphan L.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Avignon — Vaucluse</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Peintre</div>
                            

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                            <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/78.jpg">
                                <h3 class="presta-card--title">Michel L.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Dijon — Côte d'O</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Menuisier</div>
                                    <div class="presta-card--metier">Plaquiste</div>

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                                <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/62.jpg">
                                <h3 class="presta-card--title">Roman O.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Vienne — Isère</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Maçon</div>

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                                <!-- <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/61.jpg">
                                <h3 class="presta-card--title">Raphael H.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Montpellier — Hérault</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Maçon</div>
                                    <div class="presta-card--metier">Plaquiste</div>

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col>

                                <el-col :xs="12" :sm="12" :md="8" :lg="8" :xl="8" class="presta-card">
                            <div class="presta-card--item">

                                <div class="presta-card--item-head">
                                <img class="presta-card-pic" src="https://randomuser.me/api/portraits/men/60.jpg">
                                <h3 class="presta-card--title">Benoit L.</h3>
                                <span class="presta-card--location"><i class="budicon budicon-location-pin"></i> Montpellier — Hérault</span>
                                <div class="presta-card--metiers">
                                    <div class="presta-card--metier">Maçon</div>
                                    <div class="presta-card--metier">Plaquiste</div>

                                </div>
                                </div>

                                <div class="presta-card--contact">
                                    <div class="presta-card-contact-item tel"><i class="budicon budicon-call"></i></div>
                                    <div class="presta-card-contact-item email"><i class="budicon budicon-email"></i></div>
                                </div>
                            </div>
                         </el-col> -->

                        </el-row>
                </el-tab-pane>
            </el-tabs>
            </el-row>

    </div>
</template>

<script>
  export default {
      mounted() {
        this.$http.get(this.$root.URL + '/contact/get/prestataires').then(res => {
            this.contacts = res.data.sort((a,b) => {
                if (a.deletable && !b.deletable)
                    return -1;
                else if (!a.deletable && b.deletable)
                    return 1;
                else if (a.deletable && b.deletable)
                    return 0;
                else
                    return this.contactTypes.findIndex(item => item === a.contactType) - this.contactTypes.findIndex(item => item === b.contactType)
            });
            this.updateContactNbr();
        }, err => {});
      },
      data() {
          return {
            contactNbr: 0,
            contacts: [],
            popOverIndex: -1,
            contactTypes: [
                    'Banquier',
                    'Courtier en assurance',
                    'Courtier en crédit',
                    'Agent immobilier',
                    'Lotisseur',
                    'Notaire',
                    'Géomètre',
                    'Architecte',
                    'BET Géotechnique',
                    'Mairie - Service de l\'urbanisme',
                    'Engie',
                    'Enedis',
                    'Fournisseur d\'eau',
                    'Cuisiniste']
          };
      },
      methods: {
        getNoteClass(contact) {
            if (contact.note == '') return 'contact-table-note-written'
            else return 'contact-table-note-written visible'
        },
        isMobile() {
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            return x <= 1024;
        },
        updateContactNbr() {
            let nbr = this.contacts.filter((item) => item.deletable).length;
            let defaultContacts = this.contacts.filter((item) => !item.deletable);
            defaultContacts.forEach((contact) => {
                if (contact.name !== '' || contact.email !== '' || contact.phoneNumber !== '')
                nbr++;
            });
            this.contactNbr = nbr;
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
            }, err => {});
          },
          editKeyValue(e, index, field) {
                let tmp = {
                    contactType: new String(this.contacts[index].contactType),
                    name: new String(this.contacts[index].name),
                    email: new String(this.contacts[index].email),
                    phoneNumber: new String(this.contacts[index].phoneNumber),
                    deletable: this.contacts[index].deletable,
                    note: new String(this.contacts[index].note),
                    _id: this.contacts[index]._id,
                    _ref: "prestataires"
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
          addContact() {
              const basis = {
                contactType: '',
                name: '',
                email: '',
                phoneNumber: '',
                deletable: true,
                note: '',
                _ref: "prestataires"
              }
              this.$http.post(this.$root.URL + '/contact/add', basis).then(res => {
                  this.contacts.unshift(res.data);
                  this.updateContactNbr();
              }, err => {});
          }
      }
  }
</script>
<style scoped>
[contenteditable=true]:empty:before {
    content: attr(placeholder);
    color: rgba(0,0,0,0.3);
    display: block; /* For Firefox */
}
.select-jobs {
    width: 100%;
}
.contacts-table.details {
    table-layout: fixed
}
.contact-table-note-written {
    visibility: hidden;
    text-align: right;
    color: rgba(33, 45, 89, .4);
    cursor: pointer;
    position: relative;
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
    width: 1% !important;
    font-weight: 600;
    color:rgba(33, 45, 89, 1);
}
 .table-input {
    border: none;
    border-bottom-style: hidden;
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
    width: 57%;
}

.contacts-table.details .contact-metier {
    font-weight: 600;
    font-size: 1.1rem;
    color: rgba(33, 45, 89, 1);
}

.contacts-table.details tbody td {
    font-size: .95rem;
    padding: 1rem;
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
    width: 80%;
}

.contacts-table.details tbody tr:hover .table-input:hover {
    border-bottom: 1px solid rgba(33, 45, 89, .3);
    width: 80%;
    cursor: text;
}

.table-input {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    border-bottom: 1px solid rgba(33, 45, 89, .1);
    width: 80%;
}

.table-input:active, .table-input:focus {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    border-bottom: 1px solid rgba(33, 45, 89, .3);
    width: 80%;
}
.table-input:hover {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    border-bottom: 1px solid rgba(33, 45, 89, .3);
    width: 80%;
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

.presta-container {
    margin-top: 2rem;
    margin-left: .4rem;
    flex-wrap: wrap;
    position: relative;
}

.presta-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    border-radius: 5px;
    transition: .2s linear all;
    /* margin-right: 2rem; */
    margin-bottom: 2rem;
    position: relative;
    text-align: center;
}
.presta-card:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
}

.presta-card--icon {
    color: #00BBFF;
    font-size: 2.5rem;
    font-weight: 500;
}

.inspi-card--new p {
    margin: 0;
    transition: .2s linear all;
}

.presta-card--item {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    height: 100%;
}

.presta-card--item-head {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
}

.presta-card--title {
    margin-top: 1rem;
    margin-bottom: 0;
    color: rgba(35, 49, 88, 1);
}

.presta-card--location {
    color: rgba(35, 49, 88, .4);
    font-size: .9rem;
    margin-bottom: .7rem;
}

.presta-card-pic {
    border-radius: 50%;
    /* margin-bottom: 1.9rem; */
    width: 90px;
    text-align: center;
    margin: auto;
}

.presta-card--metiers {
    display: flex;
    align-items: center;
    align-content: center;
    flex-wrap: wrap;
    margin: auto;
}

.presta-card--metier {
    margin-right: .5rem;
    margin-bottom: .5rem;
    font-size: .7rem;
    border: 1px solid #00BBFF;
    border-radius: 4px;
    color: #00BBFF;
    padding: .2rem .4rem;
    min-width: 50px;
}

.presta-card--metier:last-of-type {
    margin-right: 0;
}

.presta-card--contact {
    background: rgba(35, 49, 88, .01);
    width: 100%;
    /* padding: 1rem; */
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(35, 49, 88, .06);
}

.presta-card-contact-item {
    /* background: red; */
    width: 50%;
    padding: 1rem;
    border-right: 1px solid rgba(35, 49, 88, .06);
}

.presta-card-contact-item:hover {
    background: rgba(35, 49, 88, .02);
}

.presta-card-contact-item:last-of-type {
    border-right: none;
}

.presta-card-contact-item.tel {

}

.presta-card--contact i {
    font-size: 2rem;
    color: rgba(35, 49, 88, .4);
}

.prestataire-remove {
    /* margin: 0 auto; */
    position:absolute;
    top: 25vh;
    left: 13.5%;
    color:rgba(33, 45, 89, .8);
    font-weight: 300;
    font-size: 3rem;
    text-align: center;
}

/*
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {

  .contacts-table.details tbody td {
      padding: 1rem .3rem;
  }

  .prestataire-remove {
      left: 5%;
      font-size: 2.5rem;
      text-align: center;
  }

  .credit-container {
      margin-top: 0;
  }

    .contact-table-delete.deletable {
        visibility: visible;
    }
    .contact-table-note-written {
        visibility: visible;
    }

    .contacts-table.details .contact-metier {
        font-weight: normal;
        font-size: 0.9rem;
    }
}

/*
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

    .contact-table-delete.deletable {
        visibility: visible;
    }
    .contact-table-note-written {
        visibility: visible;
    }
}
.metier-title {
    padding-left: 1rem; width: 360px !important;
}

@media (min-width: 768px) and (max-width: 1188px) {
    .metier-title {
    width: 225px !important;
}
    .contacts-table.details .contact-metier, .select-jobs > .el-input > input {
    /* color: #00BBFF; */

    width: 200px !important;
    font-size: .9rem !important;
}
}

</style>
