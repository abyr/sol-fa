(function() {

var Note = function(fields) {
    fields = fields || {}
    this.alias = fields.alias || ''
    this.type = fields.type || ''
    this.sign = fields.sign || ''
    this.signs = fields.signs || ''
}

var Notes = function() {

    this.majors = [
        {
            alias: 'Cb',
            type: 'major',
            sign: 'b',
            signs: 7
        },
        {
            alias: 'Gb',
            type: 'major',
            sign: 'b',
            signs: 6
        },
        {
            alias: 'Db',
            type: 'major',
            sign: 'b',
            signs: 5
        },
        {
            alias: 'Ab',
            type: 'major',
            sign: 'b',
            signs: 4
        },
        {
            alias: 'Eb',
            type: 'major',
            sign: 'b',
            signs: 3
        },
        {
            alias: 'Hb',
            type: 'major',
            sign: 'b',
            signs: 2
        },
        {
            alias: 'F',
            type: 'major',
            sign: 'b',
            signs: 1
        },
        {
            alias: 'C',
            type: 'major',
            sign: '',
            signs: 0
        },
        {
            alias: 'G',
            type: 'major',
            sign: '#',
            signs: 1
        },
        {
            alias: 'D',
            type: 'major',
            sign: '#',
            signs: 2
        },
        {
            alias: 'A',
            type: 'major',
            sign: '#',
            signs: 3
        },
        {
            alias: 'E',
            type: 'major',
            sign: '#',
            signs: 4
        },
        {
            alias: 'H',
            type: 'major',
            sign: '#',
            signs: 5
        },
        {
            alias: 'F#',
            type: 'major',
            sign: '#',
            signs: 6
        },
        {
            alias: 'C#',
            type: 'major',
            sign: '#',
            signs: 7
        }
    ];

    this.minors = [
        {
            alias: 'Abm',
            type: 'minor',
            sign: 'b',
            signs: 7
        },
        {
            alias: 'Ebm',
            type: 'minor',
            sign: 'b',
            signs: 6
        },
        {
            alias: 'Hbm',
            type: 'minor',
            sign: 'b',
            signs: 5
        },
        {
            alias: 'Fm',
            type: 'minor',
            sign: 'b',
            signs: 4
        },
        {
            alias: 'Cm',
            type: 'minor',
            sign: 'b',
            signs: 3
        },
        {
            alias: 'Gm',
            type: 'minor',
            sign: 'b',
            signs: 2
        },
        {
            alias: 'Dm',
            type: 'minor',
            sign: 'b',
            signs: 1
        },
        {
            alias: 'Am',
            type: 'minor',
            sign: '',
            signs: 0
        },
        {
            alias: 'Em',
            type: 'minor',
            sign: '#',
            signs: 1
        },
        {
            alias: 'Bm',
            type: 'minor',
            sign: '#',
            signs: 2
        },
        {
            alias: 'F#m',
            type: 'minor',
            sign: '#',
            signs: 3
        },
        {
            alias: 'C#m',
            type: 'minor',
            sign: '#',
            signs: 4
        },
        {
            alias: 'G#m',
            type: 'minor',
            sign: '#',
            signs: 5
        },
        {
            alias: 'D#m',
            type: 'minor',
            sign: '#',
            signs: 6
        },
        {
            alias: 'A#m',
            type: 'minor',
            sign: '#',
            signs: 7
        },

    ];

    this.all = this.majors.concat(this.minors);

}

Notes.prototype.getTonic = function(alias) {
    if (!alias) {
        return this.getRandomTonic();
    }
    return _.filter(this.all, function(note){
        return note.alias === alias
    });
}

Notes.prototype.getRandomTonic = function(filters) {
    var min = 0;
    var max = this.all.length - 1;
    var index = Math.ceil( Math.random() * (max - min) + min );
    return [this.all[index]];
}

window.Note = Note;
window.Notes = Notes;

}).call(this);