Parse.Cloud.define("hello", async (request) => {
    console.log("Hello from Cloud Code!");
    return "Hello from Cloud Code!";
});

Parse.Cloud.define("createObject", async (request) => {
    const b4aClass = new Parse.Object("B4aSampleClass");
    b4aClass.set("name", request.params.name);
    b4aClass.set("value", request.params.value);
    await b4aClass.save(null, { useMasterKey: true });
    return "Object created successfully!";
});

Parse.Cloud.beforeSave("B4aSampleClass", (request) => {
    if (request.object.get("value") === undefined) {
        request.object.set("value", 0);
    }
});

Parse.Cloud.define("getObjects", async (request) => {
    const query = new Parse.Query("B4aSampleClass");
    const objects = await query.find({ useMasterKey: true });
    return objects.map(obj => ({
        id: obj.id,
        name: obj.get("name"),
        value: obj.get("value"),
    }));
});

Parse.Cloud.job("activeAllObjects", async (request) => {
    const query = new Parse.Query("B4aSampleClass");
    const objects = await query.find({ useMasterKey: true });
    for (const obj of objects) {
        obj.set("isActive", true);
        await obj.save(null, { useMasterKey: true });
    }
});

// ===================================
// Tutor File Upload
// Bypasses client upload restriction using master key
// ===================================
Parse.Cloud.define("uploadTutorFile", async (request) => {
    const { base64, fileName, fileType } = request.params;

    if (!base64 || !fileName) {
        throw new Parse.Error(Parse.Error.INVALID_QUERY, "Missing file data.");
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const file = new Parse.File(safeName, { base64 }, fileType || 'application/octet-stream');
    await file.save({ useMasterKey: true });

    return { url: file.url(), name: file.name() };
});
