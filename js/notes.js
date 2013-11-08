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
            signs: 7,
            lang: {
                ru: 'До бемоль мажор'
            }
        },
        {
            alias: 'Gb',
            type: 'major',
            sign: 'b',
            signs: 6,
            lang: {
                ru: 'Соль бемоль мажор'
            }
        },
        {
            alias: 'Db',
            type: 'major',
            sign: 'b',
            signs: 5,
            lang: {
                ru: 'Ре бемоль мажор'
            }
        },
        {
            alias: 'Ab',
            type: 'major',
            sign: 'b',
            signs: 4,
            lang: {
                ru: 'Ля бемоль мажор'
            }
        },
        {
            alias: 'Eb',
            type: 'major',
            sign: 'b',
            signs: 3,
            lang: {
                ru: 'Ми бемоль мажор'
            }
        },
        {
            alias: 'Hb',
            type: 'major',
            sign: 'b',
            signs: 2,
            lang: {
                ru: 'Си бемоль мажор'
            }
        },
        {
            alias: 'F',
            type: 'major',
            sign: 'b',
            signs: 1,
            lang: {
                ru: 'Фа мажор'
            }
        },
        {
            alias: 'C',
            type: 'major',
            sign: '',
            signs: 0,
            lang: {
                ru: 'До мажор'
            }
        },
        {
            alias: 'G',
            type: 'major',
            sign: '#',
            signs: 1,
            lang: {
                ru: 'Соль мажор'
            }
        },
        {
            alias: 'D',
            type: 'major',
            sign: '#',
            signs: 2,
            lang: {
                ru: 'Ре мажор'
            }
        },
        {
            alias: 'A',
            type: 'major',
            sign: '#',
            signs: 3,
            lang: {
                ru: 'Ля мажор'
            }
        },
        {
            alias: 'E',
            type: 'major',
            sign: '#',
            signs: 4,
            lang: {
                ru: 'Ми мажор'
            }
        },
        {
            alias: 'H',
            type: 'major',
            sign: '#',
            signs: 5,
            lang: {
                ru: 'Си мажор'
            }
        },
        {
            alias: 'F#',
            type: 'major',
            sign: '#',
            signs: 6,
            lang: {
                ru: 'Фа диез мажор'
            }
        },
        {
            alias: 'C#',
            type: 'major',
            sign: '#',
            signs: 7,
            lang: {
                ru: 'До диез мажор'
            }
        }
    ];

    this.minors = [
        {
            alias: 'Abm',
            type: 'minor',
            sign: 'b',
            signs: 7,
            lang: {
                ru: 'Ля бемоль минор'
            }
        },
        {
            alias: 'Ebm',
            type: 'minor',
            sign: 'b',
            signs: 6,
            lang: {
                ru: 'Ми бемоль минор'
            }
        },
        {
            alias: 'Hbm',
            type: 'minor',
            sign: 'b',
            signs: 5,
            lang: {
                ru: 'Си бемоль минор'
            }
        },
        {
            alias: 'Fm',
            type: 'minor',
            sign: 'b',
            signs: 4,
            lang: {
                ru: 'Фа минор'
            }
        },
        {
            alias: 'Cm',
            type: 'minor',
            sign: 'b',
            signs: 3,
            lang: {
                ru: 'До минор'
            }
        },
        {
            alias: 'Gm',
            type: 'minor',
            sign: 'b',
            signs: 2,
            lang: {
                ru: 'Соль минор'
            }
        },
        {
            alias: 'Dm',
            type: 'minor',
            sign: 'b',
            signs: 1,
            lang: {
                ru: 'Ре минор'
            }
        },
        {
            alias: 'Am',
            type: 'minor',
            sign: '',
            signs: 0,
            lang: {
                ru: 'Ля минор'
            }
        },
        {
            alias: 'Em',
            type: 'minor',
            sign: '#',
            signs: 1,
            lang: {
                ru: 'Ми минор'
            }
        },
        {
            alias: 'Hm',
            type: 'minor',
            sign: '#',
            signs: 2,
            lang: {
                ru: 'Си минор'
            }
        },
        {
            alias: 'F#m',
            type: 'minor',
            sign: '#',
            signs: 3,
            lang: {
                ru: 'Фа диез минор'
            }
        },
        {
            alias: 'C#m',
            type: 'minor',
            sign: '#',
            signs: 4,
            lang: {
                ru: 'До диез минор'
            }
        },
        {
            alias: 'G#m',
            type: 'minor',
            sign: '#',
            signs: 5,
            lang: {
                ru: 'Соль диез минор'
            }
        },
        {
            alias: 'D#m',
            type: 'minor',
            sign: '#',
            signs: 6,
            lang: {
                ru: 'Ре диез минор'
            }
        },
        {
            alias: 'A#m',
            type: 'minor',
            sign: '#',
            signs: 7,
            lang: {
                ru: 'Ля диез минор'
            }
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
    if (typeof filters.lad === 'undefined') {
        filters.lad = false;
    }
    if (typeof filters.maxSignsCount === 'undefined') {
        filters.maxSignsCount = 7
    }

    var source = _.filter(this.all, function(note){
        var correct = true;
        if (note.signs > filters.maxSignsCount) {
            correct = false;
        }
        if (filters.lad && note.type !== filters.lad) {
            correct = false;
        }
        return correct;
    });

    var imin = -1;
    var imax = source.length - 1;
    var i = Math.random() * (imax - imin) + imin;
    var index = Math.ceil(i);

    return [source[index]];
}

window.Note = Note;
window.Notes = Notes;

}).call(this);