This java code is to be used in Niagara N4.xx(Tested on 4.11 and 4.12) workbench. The code is put inside the program blocks provided by the "program" pallete.

The instructions assumes that the user has some knowledge of Program blocks.
Instructions: 
1. Drag a progeam block and namei it postHTTP. Then open it in the "program View" tab. 
2. Click on the edit tab and copy/pase the code from postHTTP.java. 
3. In the imports tab, import everything noted on top of each java file. 
4. In "Slots" tab, right click to make a new slot. We need 3 new slots total. 
slot 1: Name: Url       type: baja:StatusString     Facets: Summary
slot 2: Name: dataIn    type: baja:StatusString     Facets: Summary
slot 3: Name: refresh   type: program:ProgramAction Facets: Summary
5. Right click the execute tab, select "config flags" and select "Hidden" flag.  
6. duplicate the postHTTP block and rename it to putHTTP. Repeat step 2 (skip 3-5)
7. repeat step 6 for deleteHTTP and getHTTP code. 
Note: deleteHTTP and getHTTP do not have the dataIn slot.
