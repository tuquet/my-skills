# Automa Icons Rule

**CRITICAL RULE**: When setting the `icon` field for Workflows or Packages in Automa JSON, you MUST use only icons that are explicitly bundled in the Automa Frontend (`vRemixicon.js`). 

If you use a random Material Design Icon (e.g. `mdiAccountGroup`), it will **NOT RENDER** because it is not included in the frontend's SVG sprite map.

## 1. Supported Packages & Workflows Icons
To ensure the icon renders correctly on the UI, use one of the following valid codes. 

### Package Default
- `mdiPackageVariantClosed`: The standard and default icon for all Packages. 
- `riGlobalLine`: The standard and default icon for all Workflows.

### Contextual Icons (Remix Icons)
If you want to use custom icons to make the UI look more beautiful and distinguishable, you MUST choose from this verified list:

**People & Groups**
- `riUserLine`, `riUser3Line`: For actions related to a single employee, member, or user.
- `riGroupLine`, `riTeamLine`: For actions related to teams, groups, or organizations.

**Data & Scrape**
- `riFileListLine`: For scraping lists, tables, or extracting multiple properties.
- `riDatabase2Line`: For data synchronization or storage.

**Actions & Navigation**
- `riAddLine`: For adding/creating something (Add Employee, Create Team).
- `riCursorLine`: For specific click/select actions.
- `riFolderOpenLine`, `riBook3Line`, `riSettings3Line`: For codebooks, categories, or settings navigation.
- `riInformationLine`: For detail views or reading information.
- `riLogoutCircleRLine`: For logout actions.

## 2. Implementation Note
When generating JSON for Automa:
```json
{
  "icon": "riGroupLine",
  // ...
}
```
*Never invent icon codes. If in doubt, default to `mdiPackageVariantClosed` for packages and `riGlobalLine` for workflows.*
