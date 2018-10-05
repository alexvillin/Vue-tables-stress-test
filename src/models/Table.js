import Vue from 'vue'

class TableModel {
    constructor(data) {
        this.id = data.id
        this.date = this.prepareDate(data)
        this.status = data.status
        this.type = data.type
        this.createdon = this.formatDate(data.createdon)
        this.file = data.file
        this.transcription = data.transcription
    }

    formatDate(val) {
        return Vue.moment(val).format("DD.MM.YYYY hh:mm:ss")
    }

    prepareDate(obj) {
        obj.start = this.formatDate(obj.start);
        obj.finish = this.formatDate(obj.finish);
        return (obj.start !== obj.finish) 
            ? obj.start + "-" + obj.finish 
            : obj.start
    }
}

export default TableModel