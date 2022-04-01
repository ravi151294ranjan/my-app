const usersModel = require("../models/admin/usersModel");
const rolesModel = require("../models/admin/rolesModel");

exports.fetch = async function (req, res) {
    try{
        let filter = req.body;
        let user = req.user;
        let userRank = await rolesModel.asyncFindOne({name: user.role}, {rank:1}).catch((err) => { throw new Error(err) });
        let rolesData =[];
        rolesData =filter.filterByRoleType;
       
        let skip = parseInt(filter.start_user);
        let limit = parseInt(filter.end_user);
        let searchValue='';
        if (filter.search_filter && filter.search_filter === true) { searchValue = filter.searchValue;}

        let condition = [
            { 
                $match: {
                    role: { $in: rolesData },
                     firstname: { '$regex': new RegExp("^" + searchValue, "i") }, 
                     status:"Active"
                },
            },
            { $sort: { firstname: 1 } },
            { $skip: skip },
            { $limit: limit }
            ];
            let data = await usersModel.asyncAggregate(condition).catch((err) => { throw new Error(err) });
        return res.status(200).json({
            success: true,
            data: data.filter(value => JSON.stringify(value) !== '{}'),
            message: "Users fetched successfully."
        });

    } catch(error){
        res.status(500).json({error: error.toString(), success: false});
    }
}

exports.post = async function (req, res) {
    try{
        let data = req.body;

        res.status(200).json({
            success: true,
            data: data,
            status: 200,
            message: "User created successfully."
        });

    } catch(error){
        res.status(500).json({error: error.toString(), success: false});
    }
}

exports.delete = async function (req, res) {
    try{
        let userEmail = req.params.email;

        let isExists = await usersModel.asyncFindOne({email: userEmail}, {_id:1}).catch((err) => { throw new Error(err) });

        if(!isExists){
            return res.status(400).json({
                success: false,
                error: "User doesn't exists"
            });
        }

        await usersModel.asyncUpsert({email: userEmail}, {status: "Inactive"}).catch((er) => { throw new Error(er) });

        res.status(200).json({
            success: true,
            message: "User deleted successfully."
        });

    } catch(error){
        res.status(500).json({error: error.toString(), success: false});
    }
}