<template>
  <v-layout row justify-center>
    <v-dialog v-model="this.$store.state.formDialog" persistent max-width="1000px">
        <v-card color="grey lighten-3">
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs3 md3 > 
                <v-card row wrap flat color="light-blue lighten-4">
                <v-text-field v-model="isolat.bactnr" type="string" label="Bact Nummer" :rules="required" required></v-text-field>
                <v-text-field v-model="isolat.repetition" label="Wiederholung" :rules="required" required></v-text-field>
                <v-text-field v-model="isolat.altid" label="Alternative ID"></v-text-field>
                <v-combobox
                  v-model="isolat.priority"
                  :items="priorityList"
                  :mask="priorityMask"
                  :label="'Priorität'"
                  persistent-hint
                  :rules="required"
                  required
                  max-length:1
                ></v-combobox>
                <v-combobox
                  v-model="isolat.pathogen"
                  :items="pathogenList"
                  :label="'Pathogen'"
                  persistent-hint
                  :rules="required"
                   required
                ></v-combobox>
                <v-text-field v-model="isolat.lastname" type="string" label="Nachname" :rules="required" required></v-text-field>
                <v-text-field v-model="isolat.firstname" type="string" label="Vorname" :rules="required" required></v-text-field>
                <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Geburtsdatum)  -->
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menuBirthday"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                  <v-text-field  slot="activator" label="Geburtsdatum"  v-model="isolat.birthdate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.birthdate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                    </v-date-picker>
                </v-menu> 
               <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Eingang)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuIsoentry"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field slot="activator" label="Eingang" v-model="isolat.isoentrydate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.isoentrydate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>                 
                </v-card>
              </v-flex>
              <v-flex xs3 md3> 
                <v-card row wrap flat color="light-blue lighten-4">
                <v-text-field v-model="isolat.sender" label="Einsender" type="string" :rules="required" required></v-text-field>
                <v-text-field v-model="isolat.department" label="Station"></v-text-field>
               <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Bearbeitungsdatum)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuProcessingdate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field slot="activator" label="Bearbeitungsdatum" v-model="isolat.processingdate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.processingdate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>
                <v-combobox
                  v-model="isolat.material"
                  :items="material"
                  :label="'Material'"
                  persistent-hint
                  :rules="required"
                   required
                ></v-combobox>
                <v-text-field v-model="isolat.ngsproject" label="NGS - Projekt" type="string" :rules="required" required></v-text-field>
                <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Abnahme)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuSampling"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field slot="activator" label="Abnahme" v-model="isolat.samplingdate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.samplingdate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>
                </v-card>
                <v-card row wrap flat color="cyan lighten-3">
                <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Datum DNA-extraktion)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuExtractiondate"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field v-if="isolat.processnr>=2" slot="activator" label="Datum DNA-extraktion" v-model="isolat.extractiondate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.extractiondate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>
                <v-text-field v-if="isolat.processnr>=2" v-model="isolat.concentration" label="DNA Konz. (ng/ul)"></v-text-field>
                <v-text-field v-if="isolat.processnr>=2" v-model="isolat.extractionvisum" label="Visum DNA"></v-text-field>
                </v-card>         
              </v-flex>
              <v-flex xs3 md3> 
                <v-card row wrap flat color="teal lighten-2">
                <v-text-field v-if="isolat.processnr>=3" v-model="isolat.runnr" label="NGS Lauf Nummer"></v-text-field>
                <v-text-field v-if="isolat.processnr>=3" v-model="isolat.isorunnr" label="Isolat Lauf Nummer"></v-text-field>
                <v-text-field v-if="isolat.processnr>=3" v-model="isolat.librarytype" label="Library Typ"></v-text-field>
                <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Datum Library)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuLibrary"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field v-if="isolat.processnr>=3" slot="activator" label="Datum Library" v-model="isolat.librarydate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.librarydate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>
                <v-text-field v-if="isolat.processnr>=3" v-model="isolat.libraryvisum" label="Visum Library"></v-text-field>
                <!--This is the datepicker for the Date textfield. the menu opens the datepicker which then contains the textfield (Datum Sequenzierung)  -->
                <v-menu 
                  lazy
                  :close-on-content-click="false"
                  v-model="menuSequencing"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-right="40"
                  max-width="290px"
                  min-width="290px"
                  >
                    <v-text-field v-if="isolat.processnr>=3" slot="activator" label="Datum Sequenzierung" v-model="isolat.sequencingdate" readonly></v-text-field>
                    <v-date-picker v-model="isolat.sequencingdate" no-title scrollable actions @input="Seqmenu =false" locale="de">
                  </v-date-picker>
                </v-menu>
                <v-text-field v-if="isolat.processnr>=3" v-model="isolat.modality" label="NGS-Gerät"></v-text-field>
                </v-card>
              </v-flex>
              <v-flex xs3 md3> 
                <v-card row wrap flat color="green lighten-2">
                <v-text-field v-if="isolat.processnr>=4" v-model="isolat.sequencingvisum" label="Sequenzierungs Visum"></v-text-field>
                <v-text-field v-if="isolat.processnr>=4" v-model="isolat.dataqualityvisum" label="Datenqualität Visum"></v-text-field>
                <v-text-field v-model="isolat.publicid" label="Public ID"></v-text-field>
                <v-text-field v-model="isolat.billing" label="Abrechnung"></v-text-field>
                <v-text-field v-model="isolat.comment" label="Kommentar"></v-text-field>  
                </v-card>
              </v-flex>
              </v-layout>
            </v-container>
            <div class="text-xs-right">
              <v-btn flat @click="cancel()">Abbrechen</v-btn>
              <v-btn v-if="!this.isolat.bactnr" color="primary" @click="create()">Erstellen</v-btn>
              <v-btn v-else color="primary" @click="submit()">Bestätigen</v-btn>
            </div>
          </v-card-text>
        </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import {mapState} from 'vuex'
import {bus} from '../main.js'

export default {
      data:() =>({
      dataset:[],
      menuBirthday:false,
      menuIsoentry:false,
      menuProcessingdate:false,
      menuExtractiondate:false,
      menuSampling:false,
      menuLibrary:false,
      menuSequencing:false,
      pathogenList: [],
      priorityMask: 'A',
      priorityList:["A","B","C","D"],
      material:["Abzess","Biopsie","Dialysat","Implantat","Gehörgangabstrich","Knochen","Punktat",
      "Hornhaut (Cornea-Set)","Konjunktivalabstrich","Liquor","Muttermilch","Spendermilch","Pleurapunktat","Wundabstrich, oberfl.",
      "Wundabstrich, tief","Anderes","BAL","Bronchialsekret","Bürste","Munde/Zungenabstrich","Nasenabstrich",
       "Nasen/Rachen gepoolt","Nasopharynxabstrich (PCR)","Blut","Blutprodukt","Rachen/Tonsillenabstrich","Trachealsekret","Blasenpunktion",
        "Dauerkatheter","Einmalkatheter","Mittelstrahl","Urinsäckchen (Säuglinge)","Cervixabstrich","Penisabstrich","Sperma",
        "Urethralabstrich","Vaginalabstrich","Vulvaabstrich","Plazenta","Stuhl","Rektalabstrich"],
      isolat: {
        bactnr: "",
        processnr: 1,
        received: false,
        firstname: "",
        lastname: "",
        birthdate: "",
        sender: "",
        department: "",
        entrydate: "",
        samplingdate: "",
        material: "",
        repetition: 0,
        altid: "",
        comment: "",
        pathogen: "",
        processingdate: "",
        ngsproject: "",
        publicid: 0,
        priority: "",
        isoentrydate: "",
        billing: "",
        concentration:"",
        extractiondate:"",
        extractionvisum:"",
        runtype:"",
        runnr:"",
        isorunnr:"",
        librarytype:"",
        librarydate:"",
        libraryvisum:"",
        sequencingdate:"",
        modality:"",
        id:""
      },
      required:[
        value => !!value || 'Datenwert ist erforderlich'
      ]
    }),
    computed:{
      ...mapState(['selectedIsolat']),
      ...mapState(['lockedId']),
      ...mapState(['pathogen']),
    
    },
    created(){
      for(var i=0; i<this.pathogen.length; i++){
        this.pathogenList.push(this.pathogen[i].Abbreviation)
      }
      this.isolat = JSON.parse(JSON.stringify(this.selectedIsolat)) //this method just places it as a json..
     // this.isolat = this.selectedIsolat
      if(this.isolat.birthdate)this.isolat.birthdate = this.dateFormatter(new Date(this.isolat.birthdate))
      if(this.isolat.entrydate) this.isolat.entrydate = this.dateFormatter(new Date(this.isolat.entrydate))
      if(this.isolat.samplingdate)this.isolat.samplingdate = this.dateFormatter(new Date(this.isolat.samplingdate))
      if(this.isolat.processingdate)this.isolat.processingdate = this.dateFormatter(new Date(this.isolat.processingdate))
      if(this.isolat.isoentrydate)this.isolat.isoentrydate = this.dateFormatter(new Date(this.isolat.isoentrydate))
      if(this.isolat.extractiondate)this.isolat.extractiondate = this.dateFormatter(new Date(this.isolat.extractiondate))
      if(this.isolat.librarydate) this.isolat.librarydate = this.dateFormatter(new Date(this.isolat.librarydate))
      if(this.isolat.sequencingdate) this.isolat.sequencingdate = this.dateFormatter(new Date(this.isolat.sequencingdate))


    },
    methods:{
      dateFormatter(date){
          var month = '' + (date.getMonth() + 1)
          var day = '' + date.getDate()
          var  year = date.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
      },
      //Method that submits the changes made to the isolat, submits it to the database and unlocks the isolatdataset again.
      submit(){
        this.$store.dispatch('putNgs', this.isolat)
        .then(response => {
              bus.$emit('positiveNotification', true)
          }, error => {
              console.log("Ups: " + error.statusCode + ": " + error.statusMessage)
              bus.$emit('negativeNotification', error)
          })
        this.lockedId.idArray.push(this.selectedIsolat.id)
        this.$store.state.formDialog = false
        this.$store.dispatch('requestUnlock', this.lockedId)
        .then(response => {
          }, error => {
            console.log("Ups: " + error.statusCode + ": " + error.statusMessage)
            bus.$emit('negativeNotification', error)
          })
        },
        //Method that submits the changes made to the isolat, submits it to the database and unlocks the isolatdataset again.
      create(){
        console.log(this.isolat)
        if(this.isolat.bactnr && this.isolat.repetition && this.isolat.priority && this.isolat.pathogen && this.isolat.firstname && this.isolat.lastname && this.isolat.sender &&this.isolat.material &&this.isolat.ngsproject ){
          this.$store.dispatch('putNgs', this.isolat)
            .then(response => {
              bus.$emit('positiveNotification', true)
                this.$store.state.formDialog = false
              }, error => {
                console.log("Ups: " + error.statusCode + ": " + error.statusMessage)
                bus.$emit('negativeNotification', error)
            })
          }
        },
        //Method that closes the Popup Form to edit the current Isolat and unlocks it again.
        cancel(){
          this.$store.dispatch('requestUnlock', this.lockedId)
          .then(response => {
          }, error => {
            console.log("Ups: " + error.statusCode + ": " + error.statusMessage)
            bus.$emit('negativeNotification', error)
          })
            this.$store.state.formDialog = false
        },
    },
}
</script>