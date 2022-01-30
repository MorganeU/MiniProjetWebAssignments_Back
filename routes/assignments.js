let Assignment = require('../model/assignment');
const users = require('../model/users');
/* let User = require('../model/users') */


// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    let filters = {}
    if (req.query.filterRendu) {
        filters.rendu = (req.query.filterRendu === 'true') ? true : false
    }
    if (req.query.search) {
        filters.nom = { $regex: req.query.search, $options: 'i' }
    }
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    }
    if (req.query.dateSort) options.sort = { dateDeRendu: req.query.dateSort }

    const user = await users.findById(req.query.userId)
    if(user.role === 'Eleve') filters.auteur = user.username
    else filters.matiere = user.matiere
    
    var aggregateQuery = Assignment.aggregate().match(filters);
    Assignment.aggregatePaginate(aggregateQuery, options,
        (err, assignments) => {
            if (err) {
                res.send(err);
            }
            res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findOne({ id: assignmentId }, (err, assignment) => {
        if (err) { res.send(err) }
        users.findOne({ matiere: assignment.matiere }, (err, prof) => {
            if (err) { res.send(err) }
            res.json({assignment, prof});
        })
    })
}

// Ajout d'un assignment pour chaque élève (POST)
function postAssignment(req, res) {

    users.find({ role: 'Eleve' }, async (err, users) => {
        for(const user of users) {
            const userAssignment = new Assignment(req.body);
            userAssignment.auteur = user.username
            userAssignment.id = Math.round(Math.random() * 1000000)+1030;
            await userAssignment.save()
        }
    })
    res.json(res.json({ message: `${req.body.nom} saved!` }))
}

/* // Ajout d'un user (POST)
function postUser(req, res) {
    let user = new User();
    user.username = req.body.username;
    user.password = req.body.password;

    console.log("POST user reçu :");
    console.log(user)

    user.save((err) => {
        if (err) {
            res.send('cant post a user ', err);
        }
        res.json({ message: `${user.username} saved!` })
    })
} */


// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
            res.json({ message: 'updated' })
        }
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
