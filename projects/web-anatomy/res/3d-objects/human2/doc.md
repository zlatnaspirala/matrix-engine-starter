
## Database:
https://lifesciencedb.jp/bp3d/

## for old Blender
https://github.com/mcvnh/blender-batch-export-obj


## for last 4
https://docs.blender.org/api/4.1/bpy.ops.wm.html#bpy.ops.wm.obj_export



## EXPORT FOR 4.1 Blender
```py
# exports each selected object into its own file

import bpy
import os

# export to blend file location
basedir = os.path.dirname(bpy.data.filepath)

if not basedir:
    raise Exception("Blend file is not saved")

view_layer = bpy.context.view_layer

obj_active = view_layer.objects.active
selection = bpy.context.selected_objects

bpy.ops.object.select_all(action='DESELECT')

for obj in selection:

    obj.select_set(True)

    # some exporters only use the active object
    view_layer.objects.active = obj

    name = bpy.path.clean_name(obj.name)
    fn = os.path.join(basedir+ "/test/", name)

    bpy.ops.wm.obj_export(filepath=fn + ".obj", 
      apply_modifiers=True, export_selected_objects=True, export_materials =False)

    # Can be used for multiple formats
    # bpy.ops.export_scene.x3d(filepath=fn + ".x3d", use_selection=True)

    obj.select_set(False)

    print("written:", fn)


view_layer.objects.active = obj_active

for obj in selection:
    obj.select_set(True)

```

## Add decimate
```py
import bpy
import os

##Cleans all decimate modifiers
def cleanAllDecimateModifiers(obj):
    for m in obj.modifiers:
        if(m.type=="DECIMATE"):
            #           print("Removing modifier ")
            obj.modifiers.remove(modifier=m)
            
            numberOfIteration=2
            decimateRatio=0.3
            modifierName='DecimateMod'

numberOfIteration=1
decimateRatio=0.36
modifierName='DecimateMod'

for i in range(0,numberOfIteration):
    objectList=bpy.data.objects
    for obj in objectList:
        if(obj.type=="MESH"):
            #cleanAllDecimateModifiers(obj)
            
            modifier=obj.modifiers.new(modifierName,'DECIMATE')
            modifier.ratio=decimateRatio
            #*(i+1)
            #modifier.use_collapse_triangulate=True
            
```

## Cleans all decimate modifiers
```py
import bpy
import os

def cleanAllDecimateModifiers(obj):
    for m in obj.modifiers:
        if(m.type=="DECIMATE"):
            #           print("Removing modifier ")
            obj.modifiers.remove(modifier=m)
            
            numberOfIteration=2
            decimateRatio=0.3
            modifierName='DecimateMod'

numberOfIteration=2
decimateRatio=0.3
modifierName='DecimateMod'

for i in range(0,numberOfIteration):
    objectList=bpy.data.objects
    for obj in objectList:
        if(obj.type=="MESH"):
            cleanAllDecimateModifiers(obj)
            
```