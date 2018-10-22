import Vue from 'vue'
import Helper from '@/helper'

class TableModel {
    constructor(data) {
        this.id = data.id
        this.date = this.prepareDate(data)
        this.status = data.status
        this.type = data.type
        this.createdon = Helper.formatDate(data.createdon)
        this.file = data.file
        this.transcription = data.transcription
    }

    prepareDate(obj) {
        obj.start = Helper.formatDate(obj.start);
        obj.finish = Helper.formatDate(obj.finish);
        return (obj.start !== obj.finish) 
            ? obj.start + "-" + obj.finish 
            : obj.start
    }
}

export default TableModel