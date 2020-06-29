const { normalizeErrors } = require('../helpers/mongoose');
const Deals = require('../models/deals');

exports.adddeal = (req, res) => {
    console.log(req.body)
    const { dealId, dealTitle, badgeClass, dealMessage, messageType, messageCount, linkCount, createdBy, assignedTo, isUserImg, status, company,imgurl } = req.body;
    const deal = new Deals({ dealId, dealTitle, badgeClass, dealMessage, messageType, messageCount, linkCount, status, company,imgurl });

    deal.save(function (err) {
        if (err) {
            return res.json({ 'status': false, 'type': 'error', 'message': 'Error occured in adding deal .Try again.' + err });
        }
        return res.json({ 'status': true, 'type': 'success', 'message': 'deal added successfully.' });
    });

}


exports.updatedeal = (req, res) => {
    console.log(req.body);
    req.body.updatedOn = new Date();
    // const { dealId, dealTitle, badgeClass, dealMessage, messageType, messageCount, linkCount, createdBy, assignedTo, isUserImg, status, company } = req.body;
    // const deal = new Deals({ dealId, dealTitle, badgeClass, dealMessage, messageType, messageCount, linkCount, status, company });
    Deals.updateMany({ _id: req.body._id }, req.body, function (err) {
        if (err) {
            return res.json({ 'status': false, 'type': 'error', 'message': 'Error occured in updating deal .Try again.' + err });
        }
    }).then(result => {
        return res.status(200).json({ message: "Update successful!" , 'result':result });
    });;
}
exports.getdeals = (req, res) => {
    Deals.find({ createdBy: req.params.id }).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.json(err);
    })
}

exports.getCompanydeals = (req, res) => {
    Deals.find({ dealId: req.params.dealId }).then((data) => {
        return res.json(data);
    }).catch((err) => {
        return res.json(err);
    })
}



