<template id="signup">
    <div class="footer">
        <input
            ref="imageUpload"
            type="file" 
            style="display:none"
            @change="handleUpload"
            multiple />
        <div ref="fileform" class="plan-upload-container" @click="openFileDialog('imageUpload')">
            <i class="plan-upload-item budicon budicon-plus-ui"></i>
        </div>
    </div>
</template>


<script>
export default {
    name: "UploadDocumentInput",
    props: {
        value: Array,
        uploadChange: Function
    },
    data() {
        return {
            dragAndDropCapable: false,
        }
    },
    mounted(){
      /*
        Determine if drag and drop functionality is capable in the browser
      */
      this.dragAndDropCapable = this.determineDragAndDropCapable();

      /*
        If drag and drop capable, then we continue to bind events to our elements.
      */
      if( this.dragAndDropCapable ){
        /*
          Listen to all of the drag events and bind an event listener to each
          for the fileform.
        */
        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
          /*
            For each event add an event listener that prevents the default action
            (opening the file in the browser) and stop the propagation of the event (so
            no other elements open the file in the browser)
          */
          this.$refs.fileform.addEventListener(evt, function(e){
            e.preventDefault();
            e.stopPropagation();
          }.bind(this), false);
        }.bind(this));

        /*
          Add an event listener for drop to the form
        */
        this.$refs.fileform.addEventListener('drop', function(e){
          /*
            Capture the files from the drop event and add them to our local files
            array.
          */
         var tmp = this.value;
          for( let i = 0; i < e.dataTransfer.files.length; i++ ){
            const retrievedFile = tmp.find((file) => file.name === e.dataTransfer.files[i].name);
            if (retrievedFile === undefined)
                tmp.push( e.dataTransfer.files[i] );
          }
          this.$emit('input', tmp);
        }.bind(this));
      }
    },
    methods: {
        determineDragAndDropCapable(){
            /*
            Create a test element to see if certain events
            are present that let us do drag and drop.
            */
            var div = document.createElement('div');

            /*
            Check to see if the `draggable` event is in the element
            or the `ondragstart` and `ondrop` events are in the element. If
            they are, then we have what we need for dragging and dropping files.

            We also check to see if the window has `FormData` and `FileReader` objects
            present so we can do our AJAX uploading
            */
            return ( ( 'draggable' in div )
                    || ( 'ondragstart' in div && 'ondrop' in div ) )
                    && 'FormData' in window
                    && 'FileReader' in window;
        },
        openFileDialog(type) {
            this.$refs[type].click();
        },
        handleUpload(event){
            const files = Array.prototype.slice.call(event.target.files);
            var tmp = this.value;
            files.forEach((item) => {
                const retrievedFile = tmp.find((file) => file.name === item.name);
                if (retrievedFile === undefined)
                    tmp.push(item);
            });
            this.uploadChange();
            this.$emit('input', tmp);
        }
    }
};
</script>
<style scoped>
    .footer {
        display: flex;
        flex-direction: column;
    }
    .plan-upload-container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px dashed rgba(35, 49, 88, .16);
        border-radius: 6px;
        padding: 2rem 0;
        background: #fff;
        box-shadow: 0 4px 10px 1px rgba(0, 0, 0, .07);
        transition: 400ms all;
    }

  .plan-upload-container:hover {
      transform: scale(1.03);
      transition: 400ms all;
      border-color: #4BC0FD ;
      box-shadow: 0 8px 22px 5px rgba(0, 0, 0, .07);
   }
   .plan-upload-container img {
        width: 35%;
        opacity: .6;
    }

    .plan-upload-container i {
        font-size: 4rem;
        opacity: .8;
        margin-top: .6rem;
        color: #4BC0FD;
        font-weight: 100;
    }

    .plan-upload-maintext {
        font-size:1.1rem;
        color: rgb(145, 151, 169);
        /* color: #31BDFC; */
        font-weight: 300;
        margin-top: .6rem;
    }
</style>
